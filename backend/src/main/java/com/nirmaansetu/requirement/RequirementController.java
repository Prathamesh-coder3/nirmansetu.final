package com.nirmaansetu.requirement;

import com.nirmaansetu.common.ApiResponse;
import com.nirmaansetu.project.Project;
import com.nirmaansetu.project.ProjectRepository;
import com.nirmaansetu.skill.SkillCategory;
import com.nirmaansetu.skill.SkillCategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/requirements")
public class RequirementController {

    private final WorkforceRequirementRepository requirementRepository;
    private final ProjectRepository projectRepository;
    private final SkillCategoryRepository skillCategoryRepository;

    public RequirementController(WorkforceRequirementRepository requirementRepository,
                                 ProjectRepository projectRepository,
                                 SkillCategoryRepository skillCategoryRepository) {
        this.requirementRepository = requirementRepository;
        this.projectRepository = projectRepository;
        this.skillCategoryRepository = skillCategoryRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listRequirements(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String skillCategoryId,
            @RequestParam(required = false) String district) {

        List<WorkforceRequirement> reqs;
        if (projectId != null) {
            reqs = requirementRepository.findByProjectId(projectId);
        } else if (skillCategoryId != null) {
            reqs = requirementRepository.findBySkillCategoryId(skillCategoryId);
        } else if (status != null) {
            try {
                reqs = requirementRepository.findByStatus(RequirementStatus.valueOf(status.toUpperCase()));
            } catch (IllegalArgumentException e) {
                reqs = requirementRepository.findAll();
            }
        } else {
            reqs = requirementRepository.findAll();
        }

        List<Map<String, Object>> result = reqs.stream()
            .map(this::enrichRequirement)
            .filter(r -> district == null || district.equalsIgnoreCase((String) r.get("district")))
            .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRequirement(@PathVariable String id) {
        WorkforceRequirement req = requirementRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Workforce requirement not found: " + id));
        return ResponseEntity.ok(ApiResponse.ok(enrichRequirement(req)));
    }

    private Map<String, Object> enrichRequirement(WorkforceRequirement r) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", r.getId());
        map.put("projectId", r.getProjectId());
        map.put("skillCategoryId", r.getSkillCategoryId());
        map.put("skillLevel", r.getSkillLevel());
        map.put("workersNeeded", r.getWorkersNeeded());
        map.put("workersFilled", r.getWorkersFilled());
        map.put("dailyWageOffered", r.getDailyWageOffered());
        map.put("dailyWageMin", r.getDailyWageMin());
        map.put("dailyWageMax", r.getDailyWageMax());
        map.put("experienceMonthsMin", r.getExperienceMonthsMin());
        map.put("certificationRequired", r.isCertificationRequired());
        map.put("startDate", r.getStartDate());
        map.put("durationDays", r.getDurationDays());
        map.put("status", r.getStatus() != null ? r.getStatus().name() : "OPEN");

        // Enrich with Project Info
        projectRepository.findById(r.getProjectId()).ifPresent(p -> {
            map.put("projectTitle", p.getTitle());
            map.put("district", p.getDistrict());
            map.put("city", p.getCity());
            map.put("agency", p.getOrgId());
            map.put("location", (p.getCity() != null ? p.getCity() + ", " : "") + p.getDistrict());
        });

        // Enrich with Skill Category Info
        skillCategoryRepository.findById(r.getSkillCategoryId()).ifPresent(s -> {
            map.put("skillCategoryName", s.getName());
            map.put("skillCode", s.getCode());
            map.put("sector", s.getSector());
        });

        return map;
    }
}
