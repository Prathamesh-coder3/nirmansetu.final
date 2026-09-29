package com.nirmaansetu.training;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, String> {
    List<TrainingProgram> findByStatus(TrainingStatus status);
    List<TrainingProgram> findBySkillCategoryId(String skillCategoryId);
    List<TrainingProgram> findByDistrict(String district);
    long countByStatus(TrainingStatus status);
}
