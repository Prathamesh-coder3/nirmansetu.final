package com.nirmaansetu.worker;

import com.nirmaansetu.common.ApiResponse;
import com.nirmaansetu.skill.SkillCategory;
import com.nirmaansetu.skill.SkillCategoryRepository;
import com.nirmaansetu.skill.WorkerSkill;
import com.nirmaansetu.skill.WorkerSkillRepository;
import com.nirmaansetu.user.User;
import com.nirmaansetu.user.UserRepository;
import com.nirmaansetu.user.UserRole;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workers")
public class WorkerController {

    private final WorkerProfileRepository workerProfileRepository;
    private final WorkerSkillRepository workerSkillRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final UserRepository userRepository;

    public WorkerController(WorkerProfileRepository workerProfileRepository,
                            WorkerSkillRepository workerSkillRepository,
                            SkillCategoryRepository skillCategoryRepository,
                            UserRepository userRepository) {
        this.workerProfileRepository = workerProfileRepository;
        this.workerSkillRepository = workerSkillRepository;
        this.skillCategoryRepository = skillCategoryRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listWorkers(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String availability,
            @RequestParam(required = false) String skill) {

        List<WorkerProfile> workers;
        if (district != null && !district.isBlank()) {
            workers = workerProfileRepository.findByDistrict(district);
        } else if (availability != null && !availability.isBlank()) {
            workers = workerProfileRepository.findByAvailabilityStatus(AvailabilityStatus.valueOf(availability.toUpperCase()));
        } else {
            workers = workerProfileRepository.findAll();
        }

        List<Map<String, Object>> result = workers.stream()
            .map(w -> buildWorkerSummary(w))
            .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getWorker(@PathVariable String id) {
        WorkerProfile worker = workerProfileRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Worker not found: " + id));
        return ResponseEntity.ok(ApiResponse.ok(buildWorkerPassport(worker)));
    }

    @GetMapping("/me/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyProfile(Authentication auth) {
        User user = getAuthUser(auth);
        WorkerProfile worker = workerProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new NoSuchElementException("Worker profile not found. Please create your profile first."));
        return ResponseEntity.ok(ApiResponse.ok(buildWorkerPassport(worker)));
    }

    @PostMapping("/me/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createProfile(
            @RequestBody WorkerProfileRequest req, Authentication auth) {
        User user = getAuthUser(auth);

        if (workerProfileRepository.findByUserId(user.getId()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error("Worker profile already exists. Use PUT to update."));
        }

        WorkerProfile profile = WorkerProfile.builder()
            .userId(user.getId())
            .fullName(req.getFullName() != null ? req.getFullName() : user.getFullName())
            .phone(req.getPhone())
            .gender(req.getGender())
            .dateOfBirth(req.getDateOfBirth() != null ? LocalDate.parse(req.getDateOfBirth()) : null)
            .state(req.getState() != null ? req.getState() : "Maharashtra")
            .district(req.getDistrict())
            .city(req.getCity())
            .address(req.getAddress())
            .pincode(req.getPincode())
            .primarySkill(req.getPrimarySkill())
            .experienceYears(req.getExperienceYears() != null ? new BigDecimal(req.getExperienceYears()) : BigDecimal.ZERO)
            .expectedDailyWage(req.getExpectedDailyWage() != null ? new BigDecimal(req.getExpectedDailyWage()) : BigDecimal.ZERO)
            .expectedMonthlyWage(req.getExpectedMonthlyWage() != null ? new BigDecimal(req.getExpectedMonthlyWage()) : BigDecimal.ZERO)
            .availabilityStatus(AvailabilityStatus.AVAILABLE)
            .verificationStatus(VerificationStatus.UNVERIFIED)
            .rating(BigDecimal.ZERO)
            .projectsCompleted(0)
            .profileCompletion(calculateCompletion(req))
            .workerCode("WRK-MH-" + (req.getDistrict() != null ? req.getDistrict().substring(0, Math.min(3, req.getDistrict().length())).toUpperCase() : "UNK") + "-" + System.currentTimeMillis())
            .build();

        profile = workerProfileRepository.save(profile);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(buildWorkerPassport(profile)));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(
            @RequestBody WorkerProfileRequest req, Authentication auth) {
        User user = getAuthUser(auth);
        WorkerProfile profile = workerProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new NoSuchElementException("Worker profile not found"));

        if (req.getFullName() != null) profile.setFullName(req.getFullName());
        if (req.getPhone() != null) profile.setPhone(req.getPhone());
        if (req.getGender() != null) profile.setGender(req.getGender());
        if (req.getDistrict() != null) profile.setDistrict(req.getDistrict());
        if (req.getCity() != null) profile.setCity(req.getCity());
        if (req.getAddress() != null) profile.setAddress(req.getAddress());
        if (req.getPrimarySkill() != null) profile.setPrimarySkill(req.getPrimarySkill());
        if (req.getExperienceYears() != null) profile.setExperienceYears(new BigDecimal(req.getExperienceYears()));
        if (req.getExpectedDailyWage() != null) profile.setExpectedDailyWage(new BigDecimal(req.getExpectedDailyWage()));
        if (req.getExpectedMonthlyWage() != null) profile.setExpectedMonthlyWage(new BigDecimal(req.getExpectedMonthlyWage()));
        if (req.getBio() != null) profile.setBio(req.getBio());
        if (req.getAvailability() != null) {
            try { profile.setAvailabilityStatus(AvailabilityStatus.valueOf(req.getAvailability())); }
            catch (IllegalArgumentException ignored) {}
        }
        profile.setProfileCompletion(calculateCompletion(req));
        profile = workerProfileRepository.save(profile);
        return ResponseEntity.ok(ApiResponse.ok(buildWorkerPassport(profile)));
    }

    @PostMapping("/me/skills")
    public ResponseEntity<ApiResponse<Map<String, Object>>> addSkill(
            @RequestBody WorkerSkillRequest req, Authentication auth) {
        User user = getAuthUser(auth);
        WorkerProfile worker = workerProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new NoSuchElementException("Worker profile not found"));

        if (workerSkillRepository.findByWorkerIdAndSkillCategoryId(worker.getId(), req.getSkillCategoryId()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error("Skill already added. Update the existing skill entry."));
        }

        WorkerSkill skill = WorkerSkill.builder()
            .workerId(worker.getId())
            .skillCategoryId(req.getSkillCategoryId())
            .skillLevel(req.getSkillLevel() != null ? req.getSkillLevel() : "BEGINNER")
            .experienceMonths(req.getExperienceMonths() != null ? req.getExperienceMonths() : 0)
            .primary(req.isPrimary())
            .verified(false)
            .build();

        workerSkillRepository.save(skill);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(Map.of("message", "Skill added successfully", "skillId", skill.getId())));
    }

    @GetMapping("/stats/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getWorkerStats() {
        long total = workerProfileRepository.count();
        long available = workerProfileRepository.countByAvailabilityStatus(AvailabilityStatus.AVAILABLE);
        long verified = workerProfileRepository.countByVerificationStatus(VerificationStatus.VERIFIED);
        long deployed = workerProfileRepository.countByAvailabilityStatus(AvailabilityStatus.DEPLOYED);

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
            "totalWorkers", total,
            "availableWorkers", available,
            "verifiedWorkers", verified,
            "deployedWorkers", deployed,
            "inTraining", workerProfileRepository.countByAvailabilityStatus(AvailabilityStatus.IN_TRAINING)
        )));
    }

    // Helper methods

    private Map<String, Object> buildWorkerSummary(WorkerProfile w) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", w.getId());
        m.put("workerCode", w.getWorkerCode());
        m.put("fullName", w.getFullName());
        m.put("primarySkill", w.getPrimarySkill());
        m.put("district", w.getDistrict());
        m.put("city", w.getCity());
        m.put("experienceYears", w.getExperienceYears());
        m.put("availabilityStatus", w.getAvailabilityStatus());
        m.put("verificationStatus", w.getVerificationStatus());
        m.put("rating", w.getRating());
        m.put("expectedDailyWage", w.getExpectedDailyWage());
        m.put("projectsCompleted", w.getProjectsCompleted());
        return m;
    }

    private Map<String, Object> buildWorkerPassport(WorkerProfile w) {
        Map<String, Object> m = buildWorkerSummary(w);
        m.put("userId", w.getUserId());
        m.put("fullName", w.getFullName());
        m.put("phone", w.getPhone());
        m.put("gender", w.getGender());
        m.put("state", w.getState());
        m.put("address", w.getAddress());
        m.put("pincode", w.getPincode());
        m.put("aadhaarVerified", w.isAadhaarVerified());
        m.put("expectedMonthlyWage", w.getExpectedMonthlyWage());
        m.put("profileCompletion", w.getProfileCompletion());
        m.put("bio", w.getBio());
        m.put("createdAt", w.getCreatedAt());

        // Include skills
        List<WorkerSkill> skills = workerSkillRepository.findByWorkerId(w.getId());
        List<Map<String, Object>> skillList = skills.stream().map(s -> {
            Map<String, Object> sm = new LinkedHashMap<>();
            sm.put("id", s.getId());
            sm.put("skillCategoryId", s.getSkillCategoryId());
            sm.put("skillLevel", s.getSkillLevel());
            sm.put("experienceMonths", s.getExperienceMonths());
            sm.put("primary", s.isPrimary());
            sm.put("verified", s.isVerified());
            sm.put("certificateNumber", s.getCertificateNumber());
            // Resolve skill name
            skillCategoryRepository.findById(s.getSkillCategoryId())
                .ifPresent(sc -> {
                    sm.put("skillName", sc.getName());
                    sm.put("skillCode", sc.getCode());
                    sm.put("sector", sc.getSector());
                });
            return sm;
        }).collect(Collectors.toList());
        m.put("skills", skillList);

        return m;
    }

    private User getAuthUser(Authentication auth) {
        return userRepository.findByUsernameOrEmail(auth.getName(), auth.getName())
            .orElseThrow(() -> new NoSuchElementException("User not found"));
    }

    private int calculateCompletion(WorkerProfileRequest req) {
        int score = 0;
        if (req.getFullName() != null) score += 15;
        if (req.getPhone() != null) score += 10;
        if (req.getDistrict() != null) score += 10;
        if (req.getPrimarySkill() != null) score += 20;
        if (req.getExperienceYears() != null) score += 15;
        if (req.getExpectedDailyWage() != null) score += 10;
        if (req.getGender() != null) score += 5;
        if (req.getAddress() != null) score += 10;
        if (req.getBio() != null) score += 5;
        return Math.min(score, 100);
    }

    // Request DTOs

    @Data
    static class WorkerProfileRequest {
        private String fullName;
        private String phone;
        private String gender;
        private String dateOfBirth;
        private String state;
        private String district;
        private String city;
        private String address;
        private String pincode;
        private String primarySkill;
        private String experienceYears;
        private String expectedDailyWage;
        private String expectedMonthlyWage;
        private String availability;
        private String bio;
    }

    @Data
    static class WorkerSkillRequest {
        private String skillCategoryId;
        private String skillLevel;
        private Integer experienceMonths;
        private boolean primary;
    }
}
