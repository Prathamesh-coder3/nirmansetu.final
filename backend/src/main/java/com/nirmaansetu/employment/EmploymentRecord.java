package com.nirmaansetu.employment;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "employment_records")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmploymentRecord {

    @Id
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;

    @Column(name = "worker_id", nullable = false)
    private String workerId;

    @Column(name = "project_id")
    private String projectId;

    @Column(name = "deployment_id")
    private String deploymentId;

    @Column(name = "org_id")
    private String orgId;

    @Column(name = "role_title")
    private String roleTitle;

    @Column(name = "skill_used")
    private String skillUsed;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "days_worked")
    private Integer daysWorked;

    @Column(name = "daily_wage")
    private BigDecimal dailyWage;

    @Column(name = "total_wages_earned")
    private BigDecimal totalWagesEarned;

    @Column(name = "monthly_equivalent")
    private BigDecimal monthlyEquivalent;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "employment_status", nullable = false)
    private EmploymentStatus employmentStatus = EmploymentStatus.ACTIVE;

    @Column(name = "performance_rating")
    private BigDecimal performanceRating;

    @Column(name = "exit_reason")
    private String exitReason;

    @Column(name = "employer_feedback")
    private String employerFeedback;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void prePersist() {
        if (id == null || id.isBlank()) {
            id = UUID.randomUUID().toString();
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getWorkerId() { return workerId; }
    public void setWorkerId(String workerId) { this.workerId = workerId; }

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }

    public String getDeploymentId() { return deploymentId; }
    public void setDeploymentId(String deploymentId) { this.deploymentId = deploymentId; }

    public String getOrgId() { return orgId; }
    public void setOrgId(String orgId) { this.orgId = orgId; }

    public String getRoleTitle() { return roleTitle; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }

    public String getSkillUsed() { return skillUsed; }
    public void setSkillUsed(String skillUsed) { this.skillUsed = skillUsed; }

    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Integer getDaysWorked() { return daysWorked; }
    public void setDaysWorked(Integer daysWorked) { this.daysWorked = daysWorked; }

    public BigDecimal getDailyWage() { return dailyWage; }
    public void setDailyWage(BigDecimal dailyWage) { this.dailyWage = dailyWage; }

    public BigDecimal getTotalWagesEarned() { return totalWagesEarned; }
    public void setTotalWagesEarned(BigDecimal totalWagesEarned) { this.totalWagesEarned = totalWagesEarned; }

    public BigDecimal getMonthlyEquivalent() { return monthlyEquivalent; }
    public void setMonthlyEquivalent(BigDecimal monthlyEquivalent) { this.monthlyEquivalent = monthlyEquivalent; }

    public EmploymentStatus getEmploymentStatus() { return employmentStatus; }
    public void setEmploymentStatus(EmploymentStatus employmentStatus) { this.employmentStatus = employmentStatus; }

    public BigDecimal getPerformanceRating() { return performanceRating; }
    public void setPerformanceRating(BigDecimal performanceRating) { this.performanceRating = performanceRating; }

    public String getExitReason() { return exitReason; }
    public void setExitReason(String exitReason) { this.exitReason = exitReason; }

    public String getEmployerFeedback() { return employerFeedback; }
    public void setEmployerFeedback(String employerFeedback) { this.employerFeedback = employerFeedback; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
