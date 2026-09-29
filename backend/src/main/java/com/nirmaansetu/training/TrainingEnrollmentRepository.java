package com.nirmaansetu.training;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TrainingEnrollmentRepository extends JpaRepository<TrainingEnrollment, String> {
    List<TrainingEnrollment> findByWorkerId(String workerId);
    List<TrainingEnrollment> findByProgramId(String programId);
    Optional<TrainingEnrollment> findByWorkerIdAndProgramId(String workerId, String programId);
    long countByCompletionStatus(EnrollmentStatus status);
    long countByProgramId(String programId);

    @Query("SELECT te.completionStatus, COUNT(te) FROM TrainingEnrollment te GROUP BY te.completionStatus")
    List<Object[]> countByStatusGrouped();
}
