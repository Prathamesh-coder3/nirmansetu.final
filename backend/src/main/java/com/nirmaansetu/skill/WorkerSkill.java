package com.nirmaansetu.skill;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "worker_skills", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"worker_id", "skill_category_id"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerSkill {

    @Id
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;

    @Column(name = "worker_id", nullable = false)
    private String workerId;

    @Column(name = "skill_category_id", nullable = false)
    private String skillCategoryId;

    @Builder.Default
    @Column(name = "skill_level")
    private String skillLevel = "BEGINNER";

    @Column(name = "experience_months")
    private int experienceMonths;

    @Column(name = "is_primary")
    private boolean primary;

    @Column(name = "is_verified")
    private boolean verified;

    @Column(name = "certificate_number")
    private String certificateNumber;

    @Column(name = "verified_by_org_id")
    private String verifiedByOrgId;

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

    public String getWorkerId() { return workerId; }
    public void setWorkerId(String workerId) { this.workerId = workerId; }

    public String getSkillCategoryId() { return skillCategoryId; }
    public void setSkillCategoryId(String skillCategoryId) { this.skillCategoryId = skillCategoryId; }

    public String getSkillLevel() { return skillLevel; }
    public void setSkillLevel(String skillLevel) { this.skillLevel = skillLevel; }

    public int getExperienceMonths() { return experienceMonths; }
    public void setExperienceMonths(int experienceMonths) { this.experienceMonths = experienceMonths; }

    public boolean isPrimary() { return primary; }
    public void setPrimary(boolean primary) { this.primary = primary; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public String getCertificateNumber() { return certificateNumber; }
    public void setCertificateNumber(String certificateNumber) { this.certificateNumber = certificateNumber; }

    public String getVerifiedByOrgId() { return verifiedByOrgId; }
    public void setVerifiedByOrgId(String verifiedByOrgId) { this.verifiedByOrgId = verifiedByOrgId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
