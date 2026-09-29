package com.nirmaansetu.training;

import com.nirmaansetu.common.ApiResponse;
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
@RequestMapping("/api/training")
public class TrainingController {

    private final TrainingProgramRepository programRepository;
    private final TrainingEnrollmentRepository enrollmentRepository;
    private final WorkerProfileRepository workerProfileRepository;
    private final UserRepository userRepository;

    public TrainingController(TrainingProgramRepository programRepository,
                              TrainingEnrollmentRepository enrollmentRepository,
                              WorkerProfileRepository workerProfileRepository,
                              UserRepository userRepository) {
        this.programRepository = programRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.workerProfileRepository = workerProfileRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/programs")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listPrograms(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String district) {
        List<TrainingProgram> programs;
        if (status != null) {
            try { programs = programRepository.findByStatus(TrainingStatus.valueOf(status.toUpperCase())); }
            catch (IllegalArgumentException e) { programs = programRepository.findAll(); }
        } else if (district != null) {
            programs = programRepository.findByDistrict(district);
        } else {
            programs = programRepository.findAll();
        }

        List<Map<String, Object>> result = programs.stream()
            .map(this::buildProgramMap)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/programs/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProgram(@PathVariable String id) {
        TrainingProgram tp = programRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Training program not found: " + id));
        return ResponseEntity.ok(ApiResponse.ok(buildProgramMap(tp)));
    }

    @PostMapping("/programs/{id}/enroll")
    public ResponseEntity<ApiResponse<Map<String, Object>>> enroll(
            @PathVariable String id, Authentication auth) {
        User user = getUser(auth);
        WorkerProfile worker = workerProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new NoSuchElementException("Worker profile not found"));

        TrainingProgram program = programRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Training program not found: " + id));

        if (enrollmentRepository.findByWorkerIdAndProgramId(worker.getId(), id).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error("Already enrolled in this program"));
        }

        TrainingEnrollment enrollment = TrainingEnrollment.builder()
            .workerId(worker.getId())
            .programId(id)
            .enrollmentDate(LocalDate.now())
            .progressPercent(0)
            .completionStatus(EnrollmentStatus.ENROLLED)
            .build();

        enrollment = enrollmentRepository.save(enrollment);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(buildEnrollmentMap(enrollment, program)));
    }

    @GetMapping("/my-enrollments")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyEnrollments(Authentication auth) {
        User user = getUser(auth);
        WorkerProfile worker = workerProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new NoSuchElementException("Worker profile not found"));

        List<TrainingEnrollment> enrollments = enrollmentRepository.findByWorkerId(worker.getId());
        List<Map<String, Object>> result = enrollments.stream().map(e -> {
            TrainingProgram program = programRepository.findById(e.getProgramId()).orElse(null);
            return buildEnrollmentMap(e, program);
        }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping("/programs")
    @PreAuthorize("hasAnyRole('TRAINING_ORGANIZATION', 'GOVERNMENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createProgram(
            @RequestBody ProgramRequest req, Authentication auth) {
        TrainingProgram program = TrainingProgram.builder()
            .name(req.getName())
            .provider(req.getProvider())
            .description(req.getDescription())
            .skillCategoryId(req.getSkillCategoryId())
            .durationDays(req.getDurationDays())
            .mode(req.getMode() != null ? req.getMode() : "OFFLINE")
            .location(req.getLocation())
            .district(req.getDistrict())
            .capacity(req.getCapacity() != null ? req.getCapacity() : 30)
            .free(true)
            .startDate(req.getStartDate() != null ? LocalDate.parse(req.getStartDate()) : null)
            .endDate(req.getEndDate() != null ? LocalDate.parse(req.getEndDate()) : null)
            .status(TrainingStatus.UPCOMING)
            .build();

        program = programRepository.save(program);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(buildProgramMap(program)));
    }

    private Map<String, Object> buildProgramMap(TrainingProgram tp) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", tp.getId());
        m.put("name", tp.getName());
        m.put("provider", tp.getProvider());
        m.put("description", tp.getDescription());
        m.put("skillCategoryId", tp.getSkillCategoryId());
        m.put("durationDays", tp.getDurationDays());
        m.put("mode", tp.getMode());
        m.put("location", tp.getLocation());
        m.put("district", tp.getDistrict());
        m.put("capacity", tp.getCapacity());
        m.put("free", tp.isFree());
        m.put("startDate", tp.getStartDate());
        m.put("endDate", tp.getEndDate());
        m.put("status", tp.getStatus());
        long enrollments = enrollmentRepository.countByProgramId(tp.getId());
        m.put("enrollments", enrollments);
        return m;
    }

    private Map<String, Object> buildEnrollmentMap(TrainingEnrollment e, TrainingProgram program) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", e.getId());
        m.put("workerId", e.getWorkerId());
        m.put("programId", e.getProgramId());
        m.put("enrollmentDate", e.getEnrollmentDate());
        m.put("progressPercent", e.getProgressPercent());
        m.put("attendancePercent", e.getAttendancePercent());
        m.put("assessmentScore", e.getAssessmentScore());
        m.put("completionStatus", e.getCompletionStatus());
        m.put("completionDate", e.getCompletionDate());
        m.put("certificateNumber", e.getCertificateNumber());
        if (program != null) {
            m.put("programName", program.getName());
            m.put("programStatus", program.getStatus());
            m.put("provider", program.getProvider());
            m.put("district", program.getDistrict());
        }
        return m;
    }

    private User getUser(Authentication auth) {
        return userRepository.findByUsernameOrEmail(auth.getName(), auth.getName())
            .orElseThrow(() -> new NoSuchElementException("User not found"));
    }

    @Data static class ProgramRequest {
        private String name, provider, description, skillCategoryId, mode, location, district, startDate, endDate;
        private Integer durationDays, capacity;
    }
}
