package com.nirmaansetu.employment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface EmploymentRecordRepository extends JpaRepository<EmploymentRecord, String> {

    List<EmploymentRecord> findByWorkerId(String workerId);

    List<EmploymentRecord> findByWorkerIdOrderByJoiningDateDesc(String workerId);

    List<EmploymentRecord> findByProjectId(String projectId);

    List<EmploymentRecord> findByEmploymentStatus(EmploymentStatus status);

    long countByEmploymentStatus(EmploymentStatus status);

    @Query("SELECT er.employmentStatus, COUNT(er) FROM EmploymentRecord er GROUP BY er.employmentStatus")
    List<Object[]> countByStatusGrouped();

    @Query("SELECT AVG(er.totalWagesEarned) FROM EmploymentRecord er WHERE er.employmentStatus = 'COMPLETED'")
    BigDecimal avgWagesCompleted();

    @Query("SELECT AVG(er.daysWorked) FROM EmploymentRecord er WHERE er.employmentStatus = 'COMPLETED'")
    Double avgDaysWorked();

    @Query("SELECT AVG(er.performanceRating) FROM EmploymentRecord er WHERE er.performanceRating IS NOT NULL")
    BigDecimal avgPerformanceRating();
}
