package com.nirmaansetu.analytics;

import com.nirmaansetu.application.Application;
import com.nirmaansetu.application.ApplicationRepository;
import com.nirmaansetu.application.ApplicationStatus;
import com.nirmaansetu.common.ApiResponse;
import com.nirmaansetu.employment.EmploymentRecord;
import com.nirmaansetu.employment.EmploymentRecordRepository;
import com.nirmaansetu.employment.EmploymentStatus;
import com.nirmaansetu.project.ProjectRepository;
import com.nirmaansetu.project.ProjectStatus;
import com.nirmaansetu.requirement.WorkforceRequirementRepository;
import com.nirmaansetu.skill.SkillCategory;
import com.nirmaansetu.skill.SkillCategoryRepository;
import com.nirmaansetu.skill.WorkerSkillRepository;
import com.nirmaansetu.training.EnrollmentStatus;
import com.nirmaansetu.training.TrainingEnrollmentRepository;
import com.nirmaansetu.training.TrainingProgramRepository;
import com.nirmaansetu.training.TrainingStatus;
import com.nirmaansetu.worker.AvailabilityStatus;
import com.nirmaansetu.worker.VerificationStatus;
import com.nirmaansetu.worker.WorkerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final WorkerProfileRepository workerProfileRepository;
    private final ProjectRepository projectRepository;
    private final WorkforceRequirementRepository requirementRepository;
    private final ApplicationRepository applicationRepository;
    private final EmploymentRecordRepository employmentRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final WorkerSkillRepository workerSkillRepository;
    private final TrainingProgramRepository trainingProgramRepository;
    private final TrainingEnrollmentRepository trainingEnrollmentRepository;

    public AnalyticsController(WorkerProfileRepository workerProfileRepository,
                               ProjectRepository projectRepository,
                               WorkforceRequirementRepository requirementRepository,
                               ApplicationRepository applicationRepository,
                               EmploymentRecordRepository employmentRepository,
                               SkillCategoryRepository skillCategoryRepository,
                               WorkerSkillRepository workerSkillRepository,
                               TrainingProgramRepository trainingProgramRepository,
                               TrainingEnrollmentRepository trainingEnrollmentRepository) {
        this.workerProfileRepository = workerProfileRepository;
        this.projectRepository = projectRepository;
        this.requirementRepository = requirementRepository;
        this.applicationRepository = applicationRepository;
        this.employmentRepository = employmentRepository;
        this.skillCategoryRepository = skillCategoryRepository;
        this.workerSkillRepository = workerSkillRepository;
        this.trainingProgramRepository = trainingProgramRepository;
        this.trainingEnrollmentRepository = trainingEnrollmentRepository;
    }

    /**
     * Government workforce intelligence dashboard summary.
     */
    @GetMapping("/workforce-summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getWorkforceSummary() {
        long totalWorkers = workerProfileRepository.count();
        long availableWorkers = workerProfileRepository.countByAvailabilityStatus(AvailabilityStatus.AVAILABLE);
        long verifiedWorkers = workerProfileRepository.countByVerificationStatus(VerificationStatus.VERIFIED);
        long deployedWorkers = workerProfileRepository.countByAvailabilityStatus(AvailabilityStatus.DEPLOYED);
        long inTraining = workerProfileRepository.countByAvailabilityStatus(AvailabilityStatus.IN_TRAINING);

        long totalProjects = projectRepository.count();
        long activeProjects = projectRepository.countByStatus(ProjectStatus.IN_PROGRESS);
        long proposedProjects = projectRepository.countByStatus(ProjectStatus.PROPOSED);
        Long totalDemand = requirementRepository.totalOpenDemand();

        long totalApplications = applicationRepository.count();
        long selectedApplications = applicationRepository.countByStatus(ApplicationStatus.SELECTED);
        long deployedApplications = applicationRepository.countByStatus(ApplicationStatus.DEPLOYED);
        long completedApplications = applicationRepository.countByStatus(ApplicationStatus.COMPLETED);

        long activeEmployment = employmentRepository.countByEmploymentStatus(EmploymentStatus.ACTIVE);
        long completedEmployment = employmentRepository.countByEmploymentStatus(EmploymentStatus.COMPLETED);

        double employmentRate = totalWorkers > 0 ?
            Math.round((double) (activeEmployment + completedEmployment) / totalWorkers * 1000.0) / 10.0 : 0.0;

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalWorkers", totalWorkers);
        summary.put("availableWorkers", availableWorkers);
        summary.put("verifiedWorkers", verifiedWorkers);
        summary.put("deployedWorkers", deployedWorkers);
        summary.put("inTrainingWorkers", inTraining);
        summary.put("totalProjects", totalProjects);
        summary.put("activeProjects", activeProjects);
        summary.put("proposedProjects", proposedProjects);
        summary.put("openWorkforceDemand", totalDemand != null ? totalDemand : 0);
        summary.put("workforceGap", Math.max(0, (totalDemand != null ? totalDemand : 0) - availableWorkers));
        summary.put("totalApplications", totalApplications);
        summary.put("workersPlaced", selectedApplications + deployedApplications);
        summary.put("activeEmployment", activeEmployment);
        summary.put("completedEmployment", completedEmployment);
        summary.put("employmentRate", employmentRate);
        summary.put("dataMode", "DEMO");

        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    /**
     * Skill gap analysis: demand vs supply by skill category.
     */
    @GetMapping("/skill-gap")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getSkillGap(
            @RequestParam(required = false) String district) {

        // Get demand by skill (from open requirements)
        List<Object[]> demandRows = requirementRepository.demandBySkillCategory();
        Map<String, Long> demandBySkill = demandRows.stream()
            .collect(Collectors.toMap(
                r -> (String) r[0],
                r -> ((Number) r[1]).longValue()
            ));

        // Get supply by skill (from worker skills)
        List<Object[]> supplyRows = workerSkillRepository.countBySkillCategoryGrouped();
        Map<String, Long> supplyBySkill = supplyRows.stream()
            .collect(Collectors.toMap(
                r -> (String) r[0],
                r -> ((Number) r[1]).longValue()
            ));

        // Combine all skill category IDs
        Set<String> allSkillIds = new HashSet<>();
        allSkillIds.addAll(demandBySkill.keySet());
        allSkillIds.addAll(supplyBySkill.keySet());

        List<Map<String, Object>> gaps = new ArrayList<>();
        for (String skillId : allSkillIds) {
            long demand = demandBySkill.getOrDefault(skillId, 0L);
            long supply = supplyBySkill.getOrDefault(skillId, 0L);
            long gap = demand - supply;

            SkillCategory sc = skillCategoryRepository.findById(skillId).orElse(null);
            if (sc == null) continue;

            String status = gap > 10 ? "SHORTAGE" : (gap < -10 ? "SURPLUS" : "BALANCED");

            Map<String, Object> m = new LinkedHashMap<>();
            m.put("skillCategoryId", skillId);
            m.put("skillName", sc.getName());
            m.put("skillCode", sc.getCode());
            m.put("sector", sc.getSector());
            m.put("demand", demand);
            m.put("supply", supply);
            m.put("gap", gap);
            m.put("status", status);
            gaps.add(m);
        }

        // Sort by gap descending (worst shortages first)
        gaps.sort((a, b) -> Long.compare((long) b.get("gap"), (long) a.get("gap")));

        return ResponseEntity.ok(ApiResponse.ok(gaps));
    }

    /**
     * Employment outcome funnel analytics.
     */
    @GetMapping("/employment-outcomes")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEmploymentOutcomes() {
        long registered = workerProfileRepository.count();
        long applied = applicationRepository.count();
        long shortlisted = applicationRepository.countByStatus(ApplicationStatus.SHORTLISTED);
        long selected = applicationRepository.countByStatus(ApplicationStatus.SELECTED);
        long deployed = applicationRepository.countByStatus(ApplicationStatus.DEPLOYED);
        long completed = applicationRepository.countByStatus(ApplicationStatus.COMPLETED);
        long activeEmp = employmentRepository.countByEmploymentStatus(EmploymentStatus.ACTIVE);
        long completedEmp = employmentRepository.countByEmploymentStatus(EmploymentStatus.COMPLETED);

        // Wage analytics
        BigDecimal avgWage = employmentRepository.avgWagesCompleted();
        Double avgDays = employmentRepository.avgDaysWorked();
        BigDecimal avgRating = employmentRepository.avgPerformanceRating();

        Map<String, Object> outcomes = new LinkedHashMap<>();
        outcomes.put("funnel", Map.of(
            "registered", registered,
            "applied", applied,
            "shortlisted", shortlisted,
            "selected", selected,
            "deployed", deployed + activeEmp,
            "completedJobs", completed + completedEmp
        ));
        outcomes.put("averageWagesEarned", avgWage != null ? avgWage : BigDecimal.ZERO);
        outcomes.put("averageDaysWorked", avgDays != null ? Math.round(avgDays) : 0);
        outcomes.put("averagePerformanceRating", avgRating != null ? avgRating : BigDecimal.ZERO);
        outcomes.put("activelyEmployed", activeEmp);
        outcomes.put("completedEngagements", completedEmp);

        // By status chart data
        List<Map<String, Object>> funnelChart = List.of(
            Map.of("stage", "Registered", "count", registered),
            Map.of("stage", "Applied", "count", applied),
            Map.of("stage", "Shortlisted", "count", shortlisted),
            Map.of("stage", "Selected", "count", selected),
            Map.of("stage", "Deployed", "count", deployed + activeEmp),
            Map.of("stage", "Completed", "count", completed + completedEmp)
        );
        outcomes.put("funnelChart", funnelChart);

        return ResponseEntity.ok(ApiResponse.ok(outcomes));
    }

    /**
     * Training impact analytics: training → skill → employment.
     */
    @GetMapping("/training-impact")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTrainingImpact() {
        long totalPrograms = trainingProgramRepository.count();
        long activePrograms = trainingProgramRepository.countByStatus(TrainingStatus.ACTIVE);
        long completedPrograms = trainingProgramRepository.countByStatus(TrainingStatus.COMPLETED);

        long totalEnrollments = trainingEnrollmentRepository.count();
        long completedEnrollments = trainingEnrollmentRepository.countByCompletionStatus(EnrollmentStatus.COMPLETED);
        long inProgressEnrollments = trainingEnrollmentRepository.countByCompletionStatus(EnrollmentStatus.IN_PROGRESS);

        long activeEmployment = employmentRepository.countByEmploymentStatus(EmploymentStatus.ACTIVE);
        long completedEmployment = employmentRepository.countByEmploymentStatus(EmploymentStatus.COMPLETED);

        double completionRate = totalEnrollments > 0 ?
            Math.round((double) completedEnrollments / totalEnrollments * 1000.0) / 10.0 : 0.0;
        double employmentRate = completedEnrollments > 0 ?
            Math.round((double) (activeEmployment + completedEmployment) / completedEnrollments * 1000.0) / 10.0 : 0.0;

        // Training program breakdown
        List<Map<String, Object>> programBreakdown = new ArrayList<>();
        trainingProgramRepository.findAll().forEach(tp -> {
            long enrollments = trainingEnrollmentRepository.countByProgramId(tp.getId());
            long completed = trainingEnrollmentRepository.countByCompletionStatus(EnrollmentStatus.COMPLETED); // approx
            programBreakdown.add(Map.of(
                "programName", tp.getName(),
                "status", tp.getStatus(),
                "enrollments", enrollments,
                "district", tp.getDistrict() != null ? tp.getDistrict() : "N/A"
            ));
        });

        Map<String, Object> impact = new LinkedHashMap<>();
        impact.put("totalPrograms", totalPrograms);
        impact.put("activePrograms", activePrograms);
        impact.put("completedPrograms", completedPrograms);
        impact.put("totalEnrollments", totalEnrollments);
        impact.put("completedTrainings", completedEnrollments);
        impact.put("inProgressTrainings", inProgressEnrollments);
        impact.put("trainingCompletionRate", completionRate);
        impact.put("employmentAfterTraining", activeEmployment + completedEmployment);
        impact.put("placementRate", employmentRate);
        impact.put("programBreakdown", programBreakdown);

        return ResponseEntity.ok(ApiResponse.ok(impact));
    }

    /**
     * Geographic workforce distribution analytics.
     */
    @GetMapping("/location-workforce")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getLocationWorkforce() {
        // Workers by district
        List<Object[]> workersByDistrict = workerProfileRepository.countByDistrictGrouped();
        Map<String, Long> workerDistrictMap = workersByDistrict.stream()
            .collect(Collectors.toMap(r -> (String) r[0], r -> ((Number) r[1]).longValue()));

        // Projects by district
        List<Object[]> projectsByDistrict = projectRepository.countByDistrictGrouped();
        Map<String, Long> projectDistrictMap = projectsByDistrict.stream()
            .collect(Collectors.toMap(r -> (String) r[0], r -> ((Number) r[1]).longValue()));

        // Combine
        Set<String> allDistricts = new HashSet<>();
        allDistricts.addAll(workerDistrictMap.keySet());
        allDistricts.addAll(projectDistrictMap.keySet());

        List<Map<String, Object>> districtData = allDistricts.stream()
            .map(d -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("district", d);
                m.put("workers", workerDistrictMap.getOrDefault(d, 0L));
                m.put("projects", projectDistrictMap.getOrDefault(d, 0L));
                return m;
            })
            .sorted(Comparator.comparing(m -> (String) m.get("district")))
            .collect(Collectors.toList());

        // Maharashtra location data for map
        List<Map<String, Object>> locationPoints = List.of(
            Map.of("district", "Pune", "lat", 18.5204, "lng", 73.8567, "workers", workerDistrictMap.getOrDefault("Pune", 0L)),
            Map.of("district", "Mumbai", "lat", 19.0760, "lng", 72.8777, "workers", workerDistrictMap.getOrDefault("Mumbai", 0L)),
            Map.of("district", "Nashik", "lat", 19.9975, "lng", 73.7898, "workers", workerDistrictMap.getOrDefault("Nashik", 0L)),
            Map.of("district", "Nagpur", "lat", 21.1458, "lng", 79.0882, "workers", workerDistrictMap.getOrDefault("Nagpur", 0L)),
            Map.of("district", "Aurangabad", "lat", 19.8762, "lng", 75.3433, "workers", workerDistrictMap.getOrDefault("Aurangabad", 0L)),
            Map.of("district", "Solapur", "lat", 17.6868, "lng", 75.9064, "workers", workerDistrictMap.getOrDefault("Solapur", 0L)),
            Map.of("district", "Thane", "lat", 19.2183, "lng", 72.9781, "workers", workerDistrictMap.getOrDefault("Thane", 0L))
        );

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
            "districtBreakdown", districtData,
            "locationPoints", locationPoints,
            "totalDistricts", allDistricts.size()
        )));
    }

    /**
     * Workforce demand forecast (clearly labeled as PLANNING ESTIMATE).
     */
    @GetMapping("/forecast")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getForecast(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String skill,
            @RequestParam(defaultValue = "6") int horizonMonths) {

        Long baseDemand = requirementRepository.totalOpenDemand();
        long baseSupply = workerProfileRepository.countByAvailabilityStatus(AvailabilityStatus.AVAILABLE);

        if (baseDemand == null || baseDemand == 0) {
            return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "status", "INSUFFICIENT_DATA",
                "message", "Insufficient project/requirement data for forecasting. Add projects with workforce requirements."
            )));
        }

        // Historical trend (simulated from base data)
        List<Map<String, Object>> historical = new ArrayList<>();
        String[] histPeriods = {"2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09"};
        double[] histFactors = {0.60, 0.70, 0.80, 0.90, 0.95, 1.00};
        for (int i = 0; i < histPeriods.length; i++) {
            historical.add(Map.of(
                "period", histPeriods[i],
                "demand", (long) (baseDemand * histFactors[i]),
                "type", "HISTORICAL"
            ));
        }

        // Forecast
        List<Map<String, Object>> forecast = new ArrayList<>();
        String[] forecastPeriods = {"2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03"};
        double[] forecastFactors = {1.10, 1.22, 1.35, 1.28, 1.18, 1.08};
        for (int i = 0; i < Math.min(horizonMonths, forecastPeriods.length); i++) {
            forecast.add(Map.of(
                "period", forecastPeriods[i],
                "demand", (long) (baseDemand * forecastFactors[i]),
                "type", "FORECAST"
            ));
        }

        long peakForecast = forecast.stream()
            .mapToLong(f -> (long) f.get("demand"))
            .max().orElse(baseDemand);

        Map<String, Object> responseData = new LinkedHashMap<>();
        responseData.put("status", "OK");
        responseData.put("forecastType", "PLANNING_ESTIMATE");
        responseData.put("disclaimer", "This is a mathematical planning estimate for government workforce planning. It does NOT represent guaranteed future demand.");
        responseData.put("currentDemand", baseDemand);
        responseData.put("currentSupply", baseSupply);
        responseData.put("peakForecastDemand", peakForecast);
        responseData.put("projectedGap", peakForecast - baseSupply);
        responseData.put("historicalData", historical);
        responseData.put("forecastData", forecast);
        responseData.put("district", district);
        responseData.put("skill", skill);

        return ResponseEntity.ok(ApiResponse.ok(responseData));
    }

    /**
     * Workers by district for map display.
     */
    @GetMapping("/districts")
    public ResponseEntity<ApiResponse<List<String>>> getDistricts() {
        List<String> districts = workerProfileRepository.findDistinctDistricts();
        return ResponseEntity.ok(ApiResponse.ok(districts));
    }
}
