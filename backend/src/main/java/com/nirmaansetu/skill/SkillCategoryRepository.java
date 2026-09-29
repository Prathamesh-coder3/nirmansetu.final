package com.nirmaansetu.skill;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SkillCategoryRepository extends JpaRepository<SkillCategory, String> {
    Optional<SkillCategory> findByCode(String code);
    List<SkillCategory> findBySectorContainingIgnoreCase(String sector);
    List<SkillCategory> findByNameContainingIgnoreCase(String name);
}
