package com.nirmaansetu.application;

import com.nirmaansetu.common.ApiResponse;
import com.nirmaansetu.matching.MatchingService;
import com.nirmaansetu.project.Project;
import com.nirmaansetu.project.ProjectRepository;
import com.nirmaansetu.requirement.WorkforceRequirement;
import com.nirmaansetu.requirement.WorkforceRequirementRepository;
import com.nirmaansetu.user.User;
import com.nirmaansetu.user.UserRepository;
import com.nirmaansetu.worker.WorkerProfile;
import com.nirmaansetu.worker.WorkerProfileRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final WorkerProfileRepository workerProfileRepository;
    private final ProjectRepository projectRepository;
    private final WorkforceRequirementRepository requirementRepository;
    private final UserRepository userRepository;
    private final MatchingService matchingService;

    public ApplicationController(ApplicationRepository applicationRepository,
                                 WorkerProfileRepository workerProfileRepository,
                                 ProjectRepository projectRepository,
                                 WorkforceRequirementRepository requirementRepository,
                                 UserRepository userRepository,
                                 MatchingService matchingService) {
        this.applicationRepository = applicationRepository;
        this.workerProfileRepository = workerProfileRepository;
        this.projectRepository = projectRepository;
        this.requirementRepository = requirementRepository;
        this.userRepository = userRepository;
        this.matchingService = matchingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> apply(
            @RequestBody ApplyRequest req, Authentication auth) {
        User user = getUser(auth);
        WorkerProfile worker = workerProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new NoSuchElementException("Worker profile not found. Create your profile first."));

        if (applicationRepository.findByWorkerIdAndRequirementId(worker.getId(), req.getRequirementId()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error("You have already applied for this position."));
        }

        WorkforceRequirement req2 = requirementRepository.findById(req.getRequirementId())
            .orElseThrow(() -> new NoSuchElementException("Requirement not found"));

        // Calculate match score
        BigDecimal score = matchingService.calculateQuickScore(worker, req2);

        Application app = Application.builder()
            .workerId(worker.getId())
            .projectId(req2.getProjectId())
            .requirementId(req.getRequirementId())
            .status(ApplicationStatus.APPLIED)
            .matchScore(score)
            .appliedAt(LocalDateTime.now())
            .build();

        app = applicationRepository.save(app);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(buildApplicationDetail(app)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyApplications(Authentication auth) {
        User user = getUser(auth);
        WorkerProfile worker = workerProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new NoSuchElementException("Worker profile not found"));

        List<Application> apps = applicationRepository.findByWorkerIdOrderByAppliedAtDesc(worker.getId());
        List<Map<String, Object>> result = apps.stream()
            .map(this::buildApplicationDetail)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('GOVERNMENT', 'PROJECT_AGENCY', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listAllApplications(
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String status) {

        List<Application> apps;
        if (projectId != null) {
            if (status != null) {
                try {
                    apps = applicationRepository.findByProjectIdAndStatus(projectId, ApplicationStatus.valueOf(status.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    apps = applicationRepository.findByProjectId(projectId);
                }
            } else {
                apps = applicationRepository.findByProjectId(projectId);
            }
        } else {
            apps = applicationRepository.findAll();
        }

        List<Map<String, Object>> result = apps.stream()
            .map(this::buildApplicationDetail)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getApplication(@PathVariable String id) {
        Application app = applicationRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Application not found: " + id));
        return ResponseEntity.ok(ApiResponse.ok(buildApplicationDetail(app)));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('GOVERNMENT', 'PROJECT_AGENCY', 'ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateStatus(
            @PathVariable String id, @RequestBody StatusUpdateRequest req) {
        Application app = applicationRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Application not found: " + id));

        ApplicationStatus newStatus;
        try {
            newStatus = ApplicationStatus.valueOf(req.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Invalid status: " + req.getStatus()));
        }

        ApplicationStatus oldStatus = app.getStatus();
        app.setStatus(newStatus);
        if (req.getNotes() != null) app.setNotes(req.getNotes());
        if (req.getRejectionReason() != null) app.setRejectionReason(req.getRejectionReason());

        // Set timestamps
        LocalDateTime now = LocalDateTime.now();
        if (newStatus == ApplicationStatus.UNDER_REVIEW && app.getReviewedAt() == null) app.setReviewedAt(now);
        if (newStatus == ApplicationStatus.SHORTLISTED && app.getShortlistedAt() == null) app.setShortlistedAt(now);
        if (newStatus == ApplicationStatus.SELECTED && app.getSelectedAt() == null) app.setSelectedAt(now);

        app = applicationRepository.save(app);
        return ResponseEntity.ok(ApiResponse.ok(buildApplicationDetail(app), "Application status updated to " + newStatus));
    }

    @PutMapping("/{id}/withdraw")
    public ResponseEntity<ApiResponse<Map<String, Object>>> withdraw(
            @PathVariable String id, Authentication auth) {
        User user = getUser(auth);
        Application app = applicationRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Application not found: " + id));

        WorkerProfile worker = workerProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new NoSuchElementException("Worker profile not found"));

        if (!app.getWorkerId().equals(worker.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("Cannot withdraw another worker's application"));
        }
        if (app.getStatus() == ApplicationStatus.DEPLOYED || app.getStatus() == ApplicationStatus.COMPLETED) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error("Cannot withdraw an application that is already deployed/completed"));
        }

        app.setStatus(ApplicationStatus.WITHDRAWN);
        app = applicationRepository.save(app);
        return ResponseEntity.ok(ApiResponse.ok(buildApplicationDetail(app), "Application withdrawn"));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        long total = applicationRepository.count();
        long applied = applicationRepository.countByStatus(ApplicationStatus.APPLIED);
        long shortlisted = applicationRepository.countByStatus(ApplicationStatus.SHORTLISTED);
        long selected = applicationRepository.countByStatus(ApplicationStatus.SELECTED);
        long deployed = applicationRepository.countByStatus(ApplicationStatus.DEPLOYED);
        long completed = applicationRepository.countByStatus(ApplicationStatus.COMPLETED);
        long rejected = applicationRepository.countByStatus(ApplicationStatus.REJECTED);

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
            "total", total,
            "applied", applied,
            "shortlisted", shortlisted,
            "selected", selected,
            "deployed", deployed,
            "completed", completed,
            "rejected", rejected
        )));
    }

    private Map<String, Object> buildApplicationDetail(Application app) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", app.getId());
        m.put("workerId", app.getWorkerId());
        m.put("projectId", app.getProjectId());
        m.put("requirementId", app.getRequirementId());
        m.put("status", app.getStatus());
        m.put("matchScore", app.getMatchScore());
        m.put("appliedAt", app.getAppliedAt());
        m.put("reviewedAt", app.getReviewedAt());
        m.put("shortlistedAt", app.getShortlistedAt());
        m.put("selectedAt", app.getSelectedAt());
        m.put("rejectionReason", app.getRejectionReason());
        m.put("notes", app.getNotes());

        // Enrich with project info
        projectRepository.findById(app.getProjectId()).ifPresent(p -> {
            m.put("projectTitle", p.getTitle());
            m.put("projectDistrict", p.getDistrict());
            m.put("projectStatus", p.getStatus());
            m.put("sector", p.getSector());
        });

        // Enrich with requirement info
        requirementRepository.findById(app.getRequirementId()).ifPresent(r -> {
            m.put("skillCategoryId", r.getSkillCategoryId());
            m.put("skillLevel", r.getSkillLevel());
            m.put("dailyWageOffered", r.getDailyWageOffered());
            m.put("durationDays", r.getDurationDays());
        });

        // Enrich with worker info
        workerProfileRepository.findById(app.getWorkerId()).ifPresent(w -> {
            m.put("workerName", w.getFullName());
            m.put("workerDistrict", w.getDistrict());
            m.put("primarySkill", w.getPrimarySkill());
        });

        return m;
    }

    private User getUser(Authentication auth) {
        return userRepository.findByUsernameOrEmail(auth.getName(), auth.getName())
            .orElseThrow(() -> new NoSuchElementException("User not found"));
    }

    @Data static class ApplyRequest {
        private String requirementId;
    }

    @Data static class StatusUpdateRequest {
        private String status;
        private String notes;
        private String rejectionReason;
    }
}
