package com.nirmaansetu.employment;

import com.nirmaansetu.common.ApiResponse;
import com.nirmaansetu.project.ProjectRepository;
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
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employment")
public class EmploymentController {

    private final EmploymentRecordRepository employmentRepository;
    private final WorkerProfileRepository workerProfileRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public EmploymentController(EmploymentRecordRepository employmentRepository,
                                WorkerProfileRepository workerProfileRepository,
                                ProjectRepository projectRepository,
                                UserRepository userRepository) {
        this.employmentRepository = employmentRepository;
        this.workerProfileRepository = workerProfileRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyEmployment(Authentication auth) {
        User user = getUser(auth);
        WorkerProfile worker = workerProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new NoSuchElementException("Worker profile not found"));

        List<EmploymentRecord> records = employmentRepository.findByWorkerIdOrderByJoiningDateDesc(worker.getId());
        List<Map<String, Object>> result = records.stream()
            .map(this::buildEmploymentMap)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('GOVERNMENT', 'PROJECT_AGENCY', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listAll(
            @RequestParam(required = false) String status) {
        List<EmploymentRecord> records;
        if (status != null) {
            try { records = employmentRepository.findByEmploymentStatus(EmploymentStatus.valueOf(status.toUpperCase())); }
            catch (IllegalArgumentException e) { records = employmentRepository.findAll(); }
        } else {
            records = employmentRepository.findAll();
        }
        List<Map<String, Object>> result = records.stream()
            .map(this::buildEmploymentMap)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getById(@PathVariable String id) {
        EmploymentRecord rec = employmentRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Employment record not found: " + id));
        return ResponseEntity.ok(ApiResponse.ok(buildEmploymentMap(rec)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('GOVERNMENT', 'PROJECT_AGENCY', 'ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createRecord(
            @RequestBody EmploymentRequest req) {
        EmploymentRecord record = EmploymentRecord.builder()
            .workerId(req.getWorkerId())
            .projectId(req.getProjectId())
            .orgId(req.getOrgId())
            .roleTitle(req.getRoleTitle())
            .skillUsed(req.getSkillUsed())
            .joiningDate(req.getJoiningDate() != null ? LocalDate.parse(req.getJoiningDate()) : LocalDate.now())
            .dailyWage(req.getDailyWage() != null ? new BigDecimal(req.getDailyWage()) : BigDecimal.ZERO)
            .employmentStatus(EmploymentStatus.ACTIVE)
            .build();

        record = employmentRepository.save(record);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(buildEmploymentMap(record)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('GOVERNMENT', 'PROJECT_AGENCY', 'ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateRecord(
            @PathVariable String id, @RequestBody EmploymentRequest req) {
        EmploymentRecord record = employmentRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Employment record not found: " + id));

        if (req.getEndDate() != null) record.setEndDate(LocalDate.parse(req.getEndDate()));
        if (req.getDaysWorked() != null) record.setDaysWorked(req.getDaysWorked());
        if (req.getDailyWage() != null) record.setDailyWage(new BigDecimal(req.getDailyWage()));
        if (req.getStatus() != null) {
            try { record.setEmploymentStatus(EmploymentStatus.valueOf(req.getStatus())); }
            catch (IllegalArgumentException ignored) {}
        }
        if (req.getPerformanceRating() != null) record.setPerformanceRating(new BigDecimal(req.getPerformanceRating()));
        if (req.getExitReason() != null) record.setExitReason(req.getExitReason());

        // Calculate total wages
        if (record.getDailyWage() != null && record.getDaysWorked() != null) {
            record.setTotalWagesEarned(record.getDailyWage().multiply(BigDecimal.valueOf(record.getDaysWorked())));
        }

        record = employmentRepository.save(record);
        return ResponseEntity.ok(ApiResponse.ok(buildEmploymentMap(record)));
    }

    private Map<String, Object> buildEmploymentMap(EmploymentRecord r) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", r.getId());
        m.put("workerId", r.getWorkerId());
        m.put("projectId", r.getProjectId());
        m.put("orgId", r.getOrgId());
        m.put("roleTitle", r.getRoleTitle());
        m.put("skillUsed", r.getSkillUsed());
        m.put("joiningDate", r.getJoiningDate());
        m.put("endDate", r.getEndDate());
        m.put("daysWorked", r.getDaysWorked());
        m.put("dailyWage", r.getDailyWage());
        m.put("totalWagesEarned", r.getTotalWagesEarned());
        m.put("monthlyEquivalent", r.getMonthlyEquivalent());
        m.put("employmentStatus", r.getEmploymentStatus());
        m.put("performanceRating", r.getPerformanceRating());
        m.put("exitReason", r.getExitReason());
        m.put("createdAt", r.getCreatedAt());

        // Enrich with project name
        if (r.getProjectId() != null) {
            projectRepository.findById(r.getProjectId()).ifPresent(p ->
                m.put("projectTitle", p.getTitle()));
        }

        // Enrich with worker name
        workerProfileRepository.findById(r.getWorkerId()).ifPresent(w ->
            m.put("workerName", w.getFullName()));

        return m;
    }

    private User getUser(Authentication auth) {
        return userRepository.findByUsernameOrEmail(auth.getName(), auth.getName())
            .orElseThrow(() -> new NoSuchElementException("User not found"));
    }

    @Data static class EmploymentRequest {
        private String workerId, projectId, orgId, roleTitle, skillUsed;
        private String joiningDate, endDate, dailyWage, performanceRating, exitReason, status;
        private Integer daysWorked;
    }
}
