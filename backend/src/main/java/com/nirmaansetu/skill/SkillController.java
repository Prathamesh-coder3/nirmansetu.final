package com.nirmaansetu.skill;

import com.nirmaansetu.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillCategoryRepository skillCategoryRepository;

    public SkillController(SkillCategoryRepository skillCategoryRepository) {
        this.skillCategoryRepository = skillCategoryRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listSkills(
            @RequestParam(required = false) String sector) {
        List<SkillCategory> skills;
        if (sector != null && !sector.isBlank()) {
            skills = skillCategoryRepository.findBySectorContainingIgnoreCase(sector);
        } else {
            skills = skillCategoryRepository.findAll();
        }
        List<Map<String, Object>> result = skills.stream()
            .map(s -> Map.<String, Object>of(
                "id", s.getId(),
                "code", s.getCode(),
                "name", s.getName(),
                "description", s.getDescription() != null ? s.getDescription() : "",
                "sector", s.getSector() != null ? s.getSector() : ""
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSkill(@PathVariable String id) {
        SkillCategory skill = skillCategoryRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Skill not found: " + id));
        return ResponseEntity.ok(ApiResponse.ok(Map.<String, Object>of(
            "id", skill.getId(),
            "code", skill.getCode(),
            "name", skill.getName(),
            "description", skill.getDescription() != null ? skill.getDescription() : "",
            "sector", skill.getSector() != null ? skill.getSector() : ""
        )));
    }
}
