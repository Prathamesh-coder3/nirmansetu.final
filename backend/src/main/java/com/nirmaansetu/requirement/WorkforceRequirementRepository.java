package com.nirmaansetu.requirement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface WorkforceRequirementRepository extends JpaRepository<WorkforceRequirement, String> {

    List<WorkforceRequirement> findByProjectId(String projectId);

    List<WorkforceRequirement> findBySkillCategoryId(String skillCategoryId);

    List<WorkforceRequirement> findByStatus(RequirementStatus status);

    List<WorkforceRequirement> findByProjectIdAndStatus(String projectId, RequirementStatus status);

    @Query("SELECT SUM(wr.workersNeeded) FROM WorkforceRequirement wr WHERE wr.status = 'OPEN'")
    Long totalOpenDemand();

    @Query("SELECT wr.skillCategoryId, SUM(wr.workersNeeded) FROM WorkforceRequirement wr " +
           "WHERE wr.status IN ('OPEN', 'PARTIALLY_FILLED') GROUP BY wr.skillCategoryId")
    List<Object[]> demandBySkillCategory();

    @Query("SELECT COUNT(wr) FROM WorkforceRequirement wr WHERE wr.projectId = :projectId AND wr.status = 'OPEN'")
    long countOpenByProject(String projectId);
}
