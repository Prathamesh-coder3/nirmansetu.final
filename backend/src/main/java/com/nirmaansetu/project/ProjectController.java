package com.nirmaansetu.project;

import com.nirmaansetu.common.ApiResponse;
import com.nirmaansetu.requirement.RequirementStatus;
import com.nirmaansetu.requirement.WorkforceRequirement;
import com.nirmaansetu.requirement.WorkforceRequirementRepository;
import com.nirmaansetu.skill.SkillCategoryRepository;
import com.nirmaansetu.user.User;
import com.nirmaansetu.user.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final WorkforceRequirementRepository requirementRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final UserRepository userRepository;

    public ProjectController(ProjectRepository projectRepository,
                             WorkforceRequirementRepository requirementRepository,
                             SkillCategoryRepository skillCategoryRepository,
                             UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.requirementRepository = requirementRepository;
        this.skillCategoryRepository = skillCategoryRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listProjects(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String sector) {

        List<Project> projects;
        if (status != null) {
            try {
                projects = projectRepository.findByStatus(ProjectStatus.valueOf(status.toUpperCase()));
            } catch (IllegalArgumentException e) {
                projects = projectRepository.findAll();
            }
        } else if (district != null) {
            projects = projectRepository.findByDistrict(district);
        } else {
            projects = projectRepository.findAll();
        }

        List<Map<String, Object>> result = projects.stream()
            .map(p -> buildProjectSummary(p))
            .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProject(@PathVariable String id) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Project not found: " + id));
        return ResponseEntity.ok(ApiResponse.ok(buildProjectDetail(project)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('GOVERNMENT', 'PROJECT_AGENCY', 'ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createProject(
            @RequestBody ProjectRequest req, Authentication auth) {
        User user = getUserFromAuth(auth);

        Project project = Project.builder()
            .projectCode("PRJ-MH-" + (req.getDistrict() != null ? req.getDistrict().substring(0, Math.min(3, req.getDistrict().length())).toUpperCase() : "MH") + "-" + System.currentTimeMillis())
            .title(req.getTitle())
            .description(req.getDescription())
            .orgId(req.getOrgId() != null ? req.getOrgId() : "org-govt-001")
            .sector(req.getSector() != null ? req.getSector() : "Infrastructure")
            .budget(req.getBudget() != null ? new BigDecimal(req.getBudget()) : null)
            .state("Maharashtra")
            .district(req.getDistrict())
            .city(req.getCity())
            .startDate(req.getStartDate() != null ? LocalDate.parse(req.getStartDate()) : null)
            .estimatedEndDate(req.getEstimatedEndDate() != null ? LocalDate.parse(req.getEstimatedEndDate()) : null)
            .status(ProjectStatus.PROPOSED)
            .createdBy(user.getId())
            .build();

        project = projectRepository.save(project);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(buildProjectDetail(project)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('GOVERNMENT', 'PROJECT_AGENCY', 'ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProject(
            @PathVariable String id, @RequestBody ProjectRequest req) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Project not found: " + id));

        if (req.getTitle() != null) project.setTitle(req.getTitle());
        if (req.getDescription() != null) project.setDescription(req.getDescription());
        if (req.getSector() != null) project.setSector(req.getSector());
        if (req.getDistrict() != null) project.setDistrict(req.getDistrict());
        if (req.getCity() != null) project.setCity(req.getCity());
        if (req.getStatus() != null) {
            try { project.setStatus(ProjectStatus.valueOf(req.getStatus())); }
            catch (IllegalArgumentException ignored) {}
        }
        if (req.getStartDate() != null) project.setStartDate(LocalDate.parse(req.getStartDate()));
        if (req.getEstimatedEndDate() != null) project.setEstimatedEndDate(LocalDate.parse(req.getEstimatedEndDate()));

        project = projectRepository.save(project);
        return ResponseEntity.ok(ApiResponse.ok(buildProjectDetail(project)));
    }

    @GetMapping("/{id}/requirements")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRequirements(@PathVariable String id) {
        List<WorkforceRequirement> reqs = requirementRepository.findByProjectId(id);
        List<Map<String, Object>> result = reqs.stream()
            .map(r -> buildRequirementDetail(r))
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping("/{id}/requirements")
    @PreAuthorize("hasAnyRole('GOVERNMENT', 'PROJECT_AGENCY', 'ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> addRequirement(
            @PathVariable String id, @RequestBody RequirementRequest req) {
        projectRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Project not found: " + id));

        WorkforceRequirement wr = WorkforceRequirement.builder()
            .projectId(id)
            .skillCategoryId(req.getSkillCategoryId())
            .skillLevel(req.getSkillLevel() != null ? req.getSkillLevel() : "SEMI_SKILLED")
            .workersNeeded(req.getWorkersNeeded() != null ? req.getWorkersNeeded() : 1)
            .workersFilled(0)
            .dailyWageOffered(req.getDailyWageOffered() != null ? new BigDecimal(req.getDailyWageOffered()) : null)
            .dailyWageMin(req.getDailyWageMin() != null ? new BigDecimal(req.getDailyWageMin()) : null)
            .dailyWageMax(req.getDailyWageMax() != null ? new BigDecimal(req.getDailyWageMax()) : null)
            .experienceMonthsMin(req.getExperienceMonthsMin())
            .certificationRequired(req.isCertificationRequired())
            .startDate(req.getStartDate() != null ? LocalDate.parse(req.getStartDate()) : null)
            .durationDays(req.getDurationDays())
            .status(RequirementStatus.OPEN)
            .build();

        wr = requirementRepository.save(wr);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(buildRequirementDetail(wr)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        long total = projectRepository.count();
        long inProgress = projectRepository.countByStatus(ProjectStatus.IN_PROGRESS);
        long proposed = projectRepository.countByStatus(ProjectStatus.PROPOSED);
        long approved = projectRepository.countByStatus(ProjectStatus.APPROVED);
        long completed = projectRepository.countByStatus(ProjectStatus.COMPLETED);
        Long totalDemand = requirementRepository.totalOpenDemand();

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
            "totalProjects", total,
            "inProgress", inProgress,
            "proposed", proposed,
            "approved", approved,
            "completed", completed,
            "totalOpenDemand", totalDemand != null ? totalDemand : 0
        )));
    }

    // Builder helpers

    private Map<String, Object> buildProjectSummary(Project p) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", p.getId());
        m.put("projectCode", p.getProjectCode());
        m.put("title", p.getTitle());
        m.put("sector", p.getSector());
        m.put("district", p.getDistrict());
        m.put("city", p.getCity());
        m.put("status", p.getStatus());
        m.put("startDate", p.getStartDate());
        m.put("estimatedEndDate", p.getEstimatedEndDate());
        m.put("budget", p.getBudget());

        // Count requirements
        long reqCount = requirementRepository.findByProjectId(p.getId()).size();
        long openReqCount = requirementRepository.countOpenByProject(p.getId());
        m.put("totalRequirements", reqCount);
        m.put("openRequirements", openReqCount);

        return m;
    }

    private Map<String, Object> buildProjectDetail(Project p) {
        Map<String, Object> m = buildProjectSummary(p);
        m.put("description", p.getDescription());
        m.put("orgId", p.getOrgId());
        m.put("assignedAgencyId", p.getAssignedAgencyId());
        m.put("state", p.getState());
        m.put("pincode", p.getPincode());
        m.put("latitude", p.getLatitude());
        m.put("longitude", p.getLongitude());
        m.put("actualEndDate", p.getActualEndDate());
        m.put("createdAt", p.getCreatedAt());
        m.put("updatedAt", p.getUpdatedAt());

        // Include requirements
        List<WorkforceRequirement> reqs = requirementRepository.findByProjectId(p.getId());
        List<Map<String, Object>> reqList = reqs.stream()
            .map(this::buildRequirementDetail)
            .collect(Collectors.toList());
        m.put("requirements", reqList);

        return m;
    }

    private Map<String, Object> buildRequirementDetail(WorkforceRequirement wr) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", wr.getId());
        m.put("projectId", wr.getProjectId());
        m.put("skillCategoryId", wr.getSkillCategoryId());
        m.put("skillLevel", wr.getSkillLevel());
        m.put("workersNeeded", wr.getWorkersNeeded());
        m.put("workersFilled", wr.getWorkersFilled());
        m.put("workersNeededNet", wr.getWorkersNeeded() - wr.getWorkersFilled());
        m.put("dailyWageOffered", wr.getDailyWageOffered());
        m.put("dailyWageMin", wr.getDailyWageMin());
        m.put("dailyWageMax", wr.getDailyWageMax());
        m.put("experienceMonthsMin", wr.getExperienceMonthsMin());
        m.put("certificationRequired", wr.isCertificationRequired());
        m.put("startDate", wr.getStartDate());
        m.put("durationDays", wr.getDurationDays());
        m.put("status", wr.getStatus());
        skillCategoryRepository.findById(wr.getSkillCategoryId())
            .ifPresent(sc -> {
                m.put("skillName", sc.getName());
                m.put("skillCode", sc.getCode());
                m.put("sector", sc.getSector());
            });
        return m;
    }

    private User getUserFromAuth(Authentication auth) {
        return userRepository.findByUsernameOrEmail(auth.getName(), auth.getName())
            .orElseThrow(() -> new NoSuchElementException("User not found"));
    }

    // DTOs
    @Data static class ProjectRequest {
        private String title, description, sector, district, city, status;
        private String startDate, estimatedEndDate, budget, orgId;
    }

    @Data static class RequirementRequest {
        private String skillCategoryId, skillLevel, startDate, dailyWageOffered, dailyWageMin, dailyWageMax;
        private Integer workersNeeded, experienceMonthsMin, durationDays;
        private boolean certificationRequired;
    }
}
