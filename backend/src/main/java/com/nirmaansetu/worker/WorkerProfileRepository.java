package com.nirmaansetu.worker;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WorkerProfileRepository extends JpaRepository<WorkerProfile, String> {

    Optional<WorkerProfile> findByUserId(String userId);

    Optional<WorkerProfile> findByWorkerCode(String workerCode);

    List<WorkerProfile> findByDistrict(String district);

    List<WorkerProfile> findByAvailabilityStatus(AvailabilityStatus status);

    List<WorkerProfile> findByVerificationStatus(VerificationStatus status);

    List<WorkerProfile> findByPrimarySkillContainingIgnoreCase(String skill);

    Page<WorkerProfile> findByDistrict(String district, Pageable pageable);

    long countByAvailabilityStatus(AvailabilityStatus status);

    long countByVerificationStatus(VerificationStatus status);

    long countByDistrict(String district);

    @Query("SELECT DISTINCT w.district FROM WorkerProfile w WHERE w.district IS NOT NULL")
    List<String> findDistinctDistricts();

    @Query("SELECT w.district, COUNT(w) FROM WorkerProfile w WHERE w.district IS NOT NULL GROUP BY w.district")
    List<Object[]> countByDistrictGrouped();

    @Query("SELECT w.availabilityStatus, COUNT(w) FROM WorkerProfile w GROUP BY w.availabilityStatus")
    List<Object[]> countByAvailabilityGrouped();
}
