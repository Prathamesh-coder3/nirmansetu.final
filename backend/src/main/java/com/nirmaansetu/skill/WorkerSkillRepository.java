package com.nirmaansetu.skill;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WorkerSkillRepository extends JpaRepository<WorkerSkill, String> {
    List<WorkerSkill> findByWorkerId(String workerId);
    Optional<WorkerSkill> findByWorkerIdAndSkillCategoryId(String workerId, String skillCategoryId);
    List<WorkerSkill> findBySkillCategoryId(String skillCategoryId);
    long countBySkillCategoryIdAndVerified(String skillCategoryId, boolean verified);

    @Query("SELECT ws.skillCategoryId, COUNT(ws) FROM WorkerSkill ws GROUP BY ws.skillCategoryId")
    List<Object[]> countBySkillCategoryGrouped();
}
