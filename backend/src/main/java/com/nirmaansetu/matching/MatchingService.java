package com.nirmaansetu.matching;

import com.nirmaansetu.skill.SkillCategory;
import com.nirmaansetu.skill.SkillCategoryRepository;
import com.nirmaansetu.skill.WorkerSkill;
import com.nirmaansetu.skill.WorkerSkillRepository;
import com.nirmaansetu.requirement.WorkforceRequirement;
import com.nirmaansetu.worker.AvailabilityStatus;
import com.nirmaansetu.worker.VerificationStatus;
import com.nirmaansetu.worker.WorkerProfile;
import com.nirmaansetu.worker.WorkerProfileRepository;
import com.nirmaansetu.project.Project;
import com.nirmaansetu.project.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

/**
 * MatchingService - Transparent rule-based worker-project matching engine.
 *
 * Score components:
 * - Skill Match:     35%
 * - Experience:      15%
 * - Verification:    15%
 * - Availability:    15%
 * - Rating:          10%
 * - Wage:            10%
 *
 * Returns detailed score breakdown + human-readable reasons.
 * Architecture: rule-based now, ML layer can be added without breaking this interface.
 */
@Service
public class MatchingService {

    private static final double SKILL_WEIGHT = 0.35;
    private static final double EXPERIENCE_WEIGHT = 0.15;
    private static final double VERIFICATION_WEIGHT = 0.15;
    private static final double AVAILABILITY_WEIGHT = 0.15;
    private static final double RATING_WEIGHT = 0.10;
    private static final double WAGE_WEIGHT = 0.10;

    private final WorkerSkillRepository workerSkillRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final WorkerProfileRepository workerProfileRepository;
    private final ProjectRepository projectRepository;

    public MatchingService(WorkerSkillRepository workerSkillRepository,
                           SkillCategoryRepository skillCategoryRepository,
                           WorkerProfileRepository workerProfileRepository,
                           ProjectRepository projectRepository) {
        this.workerSkillRepository = workerSkillRepository;
        this.skillCategoryRepository = skillCategoryRepository;
        this.workerProfileRepository = workerProfileRepository;
        this.projectRepository = projectRepository;
    }

    /**
     * Quick score computation (used during application submission).
     */
    public BigDecimal calculateQuickScore(WorkerProfile worker, WorkforceRequirement requirement) {
        MatchResult result = computeScore(worker, requirement);
        return BigDecimal.valueOf(result.overallScore()).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Full match computation with detailed breakdown and reasons.
     */
    public Map<String, Object> computeFullMatch(WorkerProfile worker, WorkforceRequirement requirement) {
        MatchResult result = computeScore(worker, requirement);
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("workerId", worker.getId());
        m.put("workerName", worker.getFullName());
        m.put("workerCode", worker.getWorkerCode());
        m.put("primarySkill", worker.getPrimarySkill());
        m.put("district", worker.getDistrict());
        m.put("overallScore", result.overallScore());
        m.put("skillScore", result.skillScore());
        m.put("experienceScore", result.experienceScore());
        m.put("verificationScore", result.verificationScore());
        m.put("availabilityScore", result.availabilityScore());
        m.put("ratingScore", result.ratingScore());
        m.put("wageScore", result.wageScore());
        m.put("matchReasons", result.reasons());
        m.put("disclaimer", "This compatibility score is a rule-based estimate to aid screening. Final selection is at the discretion of the project officer.");
        return m;
    }

    /**
     * Find all matching workers for a requirement (sorted by score).
     */
    public Map<String, Object> findMatchesForRequirement(String requirementId, double minScore) {
        // This method would be called by MatchingController
        // Returns top candidates sorted by score
        List<WorkerProfile> allWorkers = workerProfileRepository.findAll();
        List<Map<String, Object>> candidates = new ArrayList<>();

        // We need the requirement — look it up from context or pass it in
        // Since this is called from controller that has it, we'll add an overload below
        return Map.of("candidates", candidates);
    }

    public Map<String, Object> findMatchesForRequirement(WorkforceRequirement requirement, double minScore) {
        List<WorkerProfile> allWorkers = workerProfileRepository.findAll();
        SkillCategory skillCategory = skillCategoryRepository.findById(requirement.getSkillCategoryId()).orElse(null);

        List<Map<String, Object>> candidates = new ArrayList<>();
        for (WorkerProfile worker : allWorkers) {
            MatchResult result = computeScore(worker, requirement);
            if (result.overallScore() >= minScore) {
                Map<String, Object> m = computeFullMatch(worker, requirement);
                candidates.add(m);
            }
        }

        // Sort descending by overall score
        candidates.sort((a, b) -> Double.compare(
            (double) b.get("overallScore"),
            (double) a.get("overallScore")
        ));

        return Map.of(
            "requirementId", requirement.getId(),
            "skillName", skillCategory != null ? skillCategory.getName() : "Unknown",
            "skillLevel", requirement.getSkillLevel(),
            "workersNeeded", requirement.getWorkersNeeded(),
            "totalScanned", allWorkers.size(),
            "qualifiedCandidates", candidates.size(),
            "candidates", candidates,
            "disclaimer", "Scores are rule-based estimates. Not guaranteed hiring decisions."
        );
    }

    // Core scoring engine

    private MatchResult computeScore(WorkerProfile worker, WorkforceRequirement requirement) {
        double skillScore = computeSkillScore(worker, requirement);
        double experienceScore = computeExperienceScore(worker, requirement);
        double verificationScore = computeVerificationScore(worker);
        double availabilityScore = computeAvailabilityScore(worker);
        double ratingScore = computeRatingScore(worker);
        double wageScore = computeWageScore(worker, requirement);

        double overall = (skillScore * SKILL_WEIGHT) +
                         (experienceScore * EXPERIENCE_WEIGHT) +
                         (verificationScore * VERIFICATION_WEIGHT) +
                         (availabilityScore * AVAILABILITY_WEIGHT) +
                         (ratingScore * RATING_WEIGHT) +
                         (wageScore * WAGE_WEIGHT);

        overall = Math.min(100.0, Math.max(0.0, Math.round(overall * 100.0) / 100.0));

        List<String> reasons = buildReasons(worker, requirement, skillScore, experienceScore,
            verificationScore, availabilityScore, wageScore, overall);

        return new MatchResult(overall, skillScore, experienceScore, verificationScore,
            availabilityScore, ratingScore, wageScore, reasons);
    }

    private double computeSkillScore(WorkerProfile worker, WorkforceRequirement requirement) {
        // Check exact skill match in worker_skills
        Optional<WorkerSkill> exactSkill = workerSkillRepository.findByWorkerIdAndSkillCategoryId(
            worker.getId(), requirement.getSkillCategoryId());

        if (exactSkill.isPresent()) {
            WorkerSkill ws = exactSkill.get();
            double base = 100.0;
            // Bonus for verified skill
            if (ws.isVerified()) base = Math.min(100.0, base + 5.0);
            // Skill level compatibility
            String reqLevel = requirement.getSkillLevel();
            String workerLevel = ws.getSkillLevel();
            double levelBonus = computeLevelCompatibility(workerLevel, reqLevel);
            return Math.min(100.0, base * levelBonus);
        }

        // Text match on primarySkill
        if (worker.getPrimarySkill() != null) {
            SkillCategory skillCategory = skillCategoryRepository.findById(requirement.getSkillCategoryId()).orElse(null);
            if (skillCategory != null &&
                (worker.getPrimarySkill().toLowerCase().contains(skillCategory.getName().toLowerCase()) ||
                 skillCategory.getName().toLowerCase().contains(worker.getPrimarySkill().toLowerCase()))) {
                return 75.0; // Partial text match
            }
        }

        return 0.0;
    }

    private double computeLevelCompatibility(String workerLevel, String requiredLevel) {
        Map<String, Integer> levelOrder = Map.of(
            "BEGINNER", 1, "SEMI_SKILLED", 2, "SKILLED", 3, "EXPERT", 4
        );
        int workerRank = levelOrder.getOrDefault(workerLevel, 2);
        int reqRank = levelOrder.getOrDefault(requiredLevel, 2);
        if (workerRank >= reqRank) return 1.0;
        return 0.75; // under-qualified but has the skill
    }

    private double computeExperienceScore(WorkerProfile worker, WorkforceRequirement requirement) {
        int reqMonths = requirement.getExperienceMonthsMin() != null ? requirement.getExperienceMonthsMin() : 0;
        if (reqMonths <= 0) return 100.0;

        double workerMonths = worker.getExperienceYears() != null ?
            worker.getExperienceYears().doubleValue() * 12 : 0;

        if (workerMonths >= reqMonths) return 100.0;
        return Math.max(0.0, (workerMonths / reqMonths) * 100.0);
    }

    private double computeVerificationScore(WorkerProfile worker) {
        return switch (worker.getVerificationStatus()) {
            case VERIFIED -> 100.0;
            case PENDING -> 50.0;
            default -> 0.0;
        };
    }

    private double computeAvailabilityScore(WorkerProfile worker) {
        return switch (worker.getAvailabilityStatus()) {
            case AVAILABLE -> 100.0;
            case IN_TRAINING -> 50.0;
            default -> 0.0;
        };
    }

    private double computeRatingScore(WorkerProfile worker) {
        if (worker.getRating() == null || worker.getRating().compareTo(BigDecimal.ZERO) == 0) {
            return 50.0; // Neutral for unrated workers
        }
        return Math.min(100.0, (worker.getRating().doubleValue() / 5.0) * 100.0);
    }

    private double computeWageScore(WorkerProfile worker, WorkforceRequirement requirement) {
        BigDecimal offeredWage = requirement.getDailyWageOffered() != null ?
            requirement.getDailyWageOffered() : requirement.getDailyWageMax();
        BigDecimal workerExpWage = worker.getExpectedDailyWage();

        if (offeredWage == null || workerExpWage == null ||
            workerExpWage.compareTo(BigDecimal.ZERO) == 0) return 100.0;

        if (offeredWage.compareTo(workerExpWage) >= 0) return 100.0;
        double ratio = offeredWage.doubleValue() / workerExpWage.doubleValue();
        return Math.max(0.0, ratio * 100.0);
    }

    private List<String> buildReasons(WorkerProfile worker, WorkforceRequirement req,
            double skillScore, double expScore, double verScore, double availScore,
            double wageScore, double overall) {
        List<String> reasons = new ArrayList<>();

        if (skillScore >= 90) reasons.add("✓ Primary skill matches perfectly");
        else if (skillScore >= 70) reasons.add("✓ Skill matches (partial)");
        else reasons.add("✗ Skill mismatch - does not meet requirement");

        if (expScore >= 100) reasons.add("✓ Experience requirement satisfied");
        else if (expScore >= 50) reasons.add("~ Partial experience match");
        else reasons.add("✗ Insufficient experience");

        if (verScore >= 100) reasons.add("✓ Worker verified by government body");
        else if (verScore >= 50) reasons.add("~ Verification pending");
        else reasons.add("✗ Worker not verified");

        if (availScore >= 100) reasons.add("✓ Worker currently available");
        else if (availScore >= 50) reasons.add("~ Worker in training (may be available)");
        else reasons.add("✗ Worker not available");

        if (wageScore >= 100) reasons.add("✓ Wage expectation within offered range");
        else if (wageScore >= 70) reasons.add("~ Wage expectation slightly above offered");
        else reasons.add("✗ Wage expectation significantly above offered");

        if (overall >= 80) reasons.add("→ STRONG MATCH - Recommended for shortlisting");
        else if (overall >= 60) reasons.add("→ MODERATE MATCH - Consider for review");
        else reasons.add("→ WEAK MATCH - Does not meet most criteria");

        return reasons;
    }

    // Internal MatchResult DTO
    record MatchResult(
        double overallScore, double skillScore, double experienceScore,
        double verificationScore, double availabilityScore, double ratingScore,
        double wageScore, List<String> reasons) {}
}
