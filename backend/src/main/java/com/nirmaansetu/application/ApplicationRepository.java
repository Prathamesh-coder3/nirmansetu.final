package com.nirmaansetu.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, String> {

    List<Application> findByWorkerId(String workerId);

    List<Application> findByProjectId(String projectId);

    List<Application> findByRequirementId(String requirementId);

    Optional<Application> findByWorkerIdAndRequirementId(String workerId, String requirementId);

    List<Application> findByWorkerIdOrderByAppliedAtDesc(String workerId);

    Page<Application> findByStatus(ApplicationStatus status, Pageable pageable);

    List<Application> findByProjectIdAndStatus(String projectId, ApplicationStatus status);

    long countByStatus(ApplicationStatus status);

    long countByWorkerId(String workerId);

    @Query("SELECT a.status, COUNT(a) FROM Application a GROUP BY a.status")
    List<Object[]> countByStatusGrouped();

    @Query("SELECT COUNT(a) FROM Application a WHERE a.workerId = :workerId AND a.status NOT IN ('REJECTED', 'WITHDRAWN')")
    long countActiveByWorker(String workerId);
}
