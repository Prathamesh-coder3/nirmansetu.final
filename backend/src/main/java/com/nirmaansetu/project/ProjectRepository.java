package com.nirmaansetu.project;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, String> {

    List<Project> findByStatus(ProjectStatus status);

    List<Project> findByOrgId(String orgId);

    List<Project> findByDistrict(String district);

    Page<Project> findByStatus(ProjectStatus status, Pageable pageable);

    Page<Project> findByOrgId(String orgId, Pageable pageable);

    long countByStatus(ProjectStatus status);

    long countByDistrict(String district);

    @Query("SELECT p.status, COUNT(p) FROM Project p GROUP BY p.status")
    List<Object[]> countByStatusGrouped();

    @Query("SELECT p.district, COUNT(p) FROM Project p WHERE p.district IS NOT NULL GROUP BY p.district")
    List<Object[]> countByDistrictGrouped();

    @Query("SELECT p.sector, COUNT(p) FROM Project p GROUP BY p.sector")
    List<Object[]> countBySectorGrouped();
}
