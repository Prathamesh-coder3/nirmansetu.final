package com.nirmaansetu.requirement;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "workforce_requirements")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkforceRequirement {

    @Id
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;

    @Column(name = "project_id", nullable = false)
    private String projectId;

    @Column(name = "skill_category_id", nullable = false)
    private String skillCategoryId;

    @Builder.Default
    @Column(name = "skill_level")
    private String skillLevel = "SEMI_SKILLED";

    @Column(name = "workers_needed")
    private int workersNeeded;

    @Column(name = "workers_filled")
    private int workersFilled;

    @Column(name = "daily_wage_min")
    private BigDecimal dailyWageMin;

    @Column(name = "daily_wage_max")
    private BigDecimal dailyWageMax;

    @Column(name = "daily_wage_offered")
    private BigDecimal dailyWageOffered;

    @Column(name = "experience_months_min")
    private Integer experienceMonthsMin;

    @Column(name = "certification_required")
    private boolean certificationRequired;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "duration_days")
    private Integer durationDays;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequirementStatus status = RequirementStatus.OPEN;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void prePersist() {
        if (id == null || id.isBlank()) {
            id = UUID.randomUUID().toString();
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }

    public String getSkillCategoryId() { return skillCategoryId; }
    public void setSkillCategoryId(String skillCategoryId) { this.skillCategoryId = skillCategoryId; }

    public String getSkillLevel() { return skillLevel; }
    public void setSkillLevel(String skillLevel) { this.skillLevel = skillLevel; }

    public int getWorkersNeeded() { return workersNeeded; }
    public void setWorkersNeeded(int workersNeeded) { this.workersNeeded = workersNeeded; }

    public int getWorkersFilled() { return workersFilled; }
    public void setWorkersFilled(int workersFilled) { this.workersFilled = workersFilled; }

    public BigDecimal getDailyWageMin() { return dailyWageMin; }
    public void setDailyWageMin(BigDecimal dailyWageMin) { this.dailyWageMin = dailyWageMin; }

    public BigDecimal getDailyWageMax() { return dailyWageMax; }
    public void setDailyWageMax(BigDecimal dailyWageMax) { this.dailyWageMax = dailyWageMax; }

    public BigDecimal getDailyWageOffered() { return dailyWageOffered; }
    public void setDailyWageOffered(BigDecimal dailyWageOffered) { this.dailyWageOffered = dailyWageOffered; }

    public Integer getExperienceMonthsMin() { return experienceMonthsMin; }
    public void setExperienceMonthsMin(Integer experienceMonthsMin) { this.experienceMonthsMin = experienceMonthsMin; }

    public boolean isCertificationRequired() { return certificationRequired; }
    public void setCertificationRequired(boolean certificationRequired) { this.certificationRequired = certificationRequired; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }

    public RequirementStatus getStatus() { return status; }
    public void setStatus(RequirementStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
