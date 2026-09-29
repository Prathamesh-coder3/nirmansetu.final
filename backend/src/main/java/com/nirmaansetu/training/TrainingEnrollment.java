package com.nirmaansetu.training;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "training_enrollments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"worker_id", "program_id"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingEnrollment {

    @Id
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;

    @Column(name = "worker_id", nullable = false)
    private String workerId;

    @Column(name = "program_id", nullable = false)
    private String programId;

    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate;

    @Column(name = "progress_percent")
    private int progressPercent;

    @Column(name = "attendance_percent")
    private BigDecimal attendancePercent;

    @Column(name = "assessment_score")
    private BigDecimal assessmentScore;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "completion_status", nullable = false)
    private EnrollmentStatus completionStatus = EnrollmentStatus.ENROLLED;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @Column(name = "certificate_number")
    private String certificateNumber;

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
        if (enrollmentDate == null) {
            enrollmentDate = LocalDate.now();
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getWorkerId() { return workerId; }
    public void setWorkerId(String workerId) { this.workerId = workerId; }

    public String getProgramId() { return programId; }
    public void setProgramId(String programId) { this.programId = programId; }

    public LocalDate getEnrollmentDate() { return enrollmentDate; }
    public void setEnrollmentDate(LocalDate enrollmentDate) { this.enrollmentDate = enrollmentDate; }

    public int getProgressPercent() { return progressPercent; }
    public void setProgressPercent(int progressPercent) { this.progressPercent = progressPercent; }

    public BigDecimal getAttendancePercent() { return attendancePercent; }
    public void setAttendancePercent(BigDecimal attendancePercent) { this.attendancePercent = attendancePercent; }

    public BigDecimal getAssessmentScore() { return assessmentScore; }
    public void setAssessmentScore(BigDecimal assessmentScore) { this.assessmentScore = assessmentScore; }

    public EnrollmentStatus getCompletionStatus() { return completionStatus; }
    public void setCompletionStatus(EnrollmentStatus completionStatus) { this.completionStatus = completionStatus; }

    public LocalDate getCompletionDate() { return completionDate; }
    public void setCompletionDate(LocalDate completionDate) { this.completionDate = completionDate; }

    public String getCertificateNumber() { return certificateNumber; }
    public void setCertificateNumber(String certificateNumber) { this.certificateNumber = certificateNumber; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
