-- NirmaanSetu - V1 Schema Migration
-- Workforce Skilling and Employment Outcome Intelligence Platform
-- Government of Maharashtra, SIH Problem 26135

-- ============================================================
-- ENUMS (H2 compatible using VARCHAR with check constraints)
-- ============================================================

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id                  VARCHAR(36) DEFAULT RANDOM_UUID() PRIMARY KEY,
    username            VARCHAR(100) NOT NULL UNIQUE,
    email               VARCHAR(255) UNIQUE,
    phone               VARCHAR(15) UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,
    full_name           VARCHAR(255) NOT NULL,
    role                VARCHAR(30) NOT NULL DEFAULT 'WORKER',
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ORGANIZATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS organizations (
    id                  VARCHAR(36) DEFAULT RANDOM_UUID() PRIMARY KEY,
    user_id             VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    org_name            VARCHAR(255) NOT NULL,
    org_type            VARCHAR(50) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    state               VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
    district            VARCHAR(100),
    city                VARCHAR(100),
    address             TEXT,
    contact_person      VARCHAR(255),
    contact_email       VARCHAR(255),
    contact_phone       VARCHAR(15),
    verification_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- LOCATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS locations (
    id          VARCHAR(36) DEFAULT RANDOM_UUID() PRIMARY KEY,
    state       VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
    district    VARCHAR(100) NOT NULL,
    city        VARCHAR(100),
    pincode     VARCHAR(10),
    latitude    DECIMAL(10,7),
    longitude   DECIMAL(10,7)
);

-- ============================================================
-- SKILL CATEGORIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS skill_categories (
    id          VARCHAR(36) DEFAULT RANDOM_UUID() PRIMARY KEY,
    code        VARCHAR(50) NOT NULL UNIQUE,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    sector      VARCHAR(100)
);

-- ============================================================
-- WORKER PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS worker_profiles (
    id                  VARCHAR(36) DEFAULT RANDOM_UUID() PRIMARY KEY,
    user_id             VARCHAR(36) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    location_id         VARCHAR(36) REFERENCES locations(id) ON DELETE SET NULL,
    worker_code         VARCHAR(50) UNIQUE,
    full_name           VARCHAR(255) NOT NULL,
    phone               VARCHAR(15),
    gender              VARCHAR(10),
    date_of_birth       DATE,
    state               VARCHAR(100) DEFAULT 'Maharashtra',
    district            VARCHAR(100),
    city                VARCHAR(100),
    address             TEXT,
    pincode             VARCHAR(10),
    latitude            DECIMAL(10,7),
    longitude           DECIMAL(10,7),
    primary_skill       VARCHAR(100),
    experience_years    DECIMAL(4,1) NOT NULL DEFAULT 0,
    aadhaar_verified    BOOLEAN NOT NULL DEFAULT FALSE,
    expected_daily_wage DECIMAL(10,2) DEFAULT 0,
    expected_monthly_wage DECIMAL(10,2) DEFAULT 0,
    availability_status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    verification_status VARCHAR(20) NOT NULL DEFAULT 'UNVERIFIED',
    verified_by_org_id  VARCHAR(36) REFERENCES organizations(id) ON DELETE SET NULL,
    rating              DECIMAL(3,2) DEFAULT 0,
    projects_completed  INTEGER NOT NULL DEFAULT 0,
    profile_completion  INTEGER NOT NULL DEFAULT 0,
    bio                 TEXT,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- WORKER SKILLS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS worker_skills (
    id                  VARCHAR(36) DEFAULT RANDOM_UUID() PRIMARY KEY,
    worker_id           VARCHAR(36) NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
    skill_category_id   VARCHAR(36) NOT NULL REFERENCES skill_categories(id),
    skill_level         VARCHAR(30) NOT NULL DEFAULT 'BEGINNER',
    experience_months   INTEGER NOT NULL DEFAULT 0,
    is_primary          BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
    certificate_number  VARCHAR(100),
    verified_by_org_id  VARCHAR(36) REFERENCES organizations(id),
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (worker_id, skill_category_id)
);

-- ============================================================
-- PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
    id                  VARCHAR(36) DEFAULT RANDOM_UUID() PRIMARY KEY,
    project_code        VARCHAR(100) NOT NULL UNIQUE,
    title               VARCHAR(500) NOT NULL,
    description         TEXT,
    org_id              VARCHAR(36) NOT NULL REFERENCES organizations(id),
    assigned_agency_id  VARCHAR(36) REFERENCES organizations(id),
    sector              VARCHAR(100) NOT NULL,
    budget              DECIMAL(15,2),
    state               VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
    district            VARCHAR(100),
    city                VARCHAR(100),
    location_id         VARCHAR(36) REFERENCES locations(id),
    pincode             VARCHAR(10),
    latitude            DECIMAL(10,7),
    longitude           DECIMAL(10,7),
    start_date          DATE,
    estimated_end_date  DATE,
    actual_end_date     DATE,
    status              VARCHAR(30) NOT NULL DEFAULT 'PROPOSED',
    created_by          VARCHAR(36) REFERENCES users(id),
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- WORKFORCE REQUIREMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS workforce_requirements (
    id                  VARCHAR(36) DEFAULT RANDOM_UUID() PRIMARY KEY,
    project_id          VARCHAR(36) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    skill_category_id   VARCHAR(36) NOT NULL REFERENCES skill_categories(id),
    skill_level         VARCHAR(30) NOT NULL DEFAULT 'SEMI_SKILLED',
    workers_needed      INTEGER NOT NULL DEFAULT 1,
    workers_filled      INTEGER NOT NULL DEFAULT 0,
    daily_wage_min      DECIMAL(10,2),
    daily_wage_max      DECIMAL(10,2),
    daily_wage_offered  DECIMAL(10,2),
    experience_months_min INTEGER DEFAULT 0,
    certification_required BOOLEAN NOT NULL DEFAULT FALSE,
    start_date          DATE,
    duration_days       INTEGER,
    status              VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- APPLICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS applications (
    id                  VARCHAR(36) DEFAULT RANDOM_UUID() PRIMARY KEY,
    worker_id           VARCHAR(36) NOT NULL REFERENCES worker_profiles(id),
    project_id          VARCHAR(36) NOT NULL REFERENCES projects(id),
    requirement_id      VARCHAR(36) NOT NULL REFERENCES workforce_requirements(id),
    status              VARCHAR(30) NOT NULL DEFAULT 'APPLIED',
    match_score         DECIMAL(5,2) DEFAULT 0,
    applied_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at         TIMESTAMP,
    shortlisted_at      TIMESTAMP,
    selected_at         TIMESTAMP,
    rejection_reason    TEXT,
    notes               TEXT,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (worker_id, requirement_id)
);

-- ============================================================
-- DEPLOYMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS deployments (
    id                  VARCHAR(36) DEFAULT RANDOM_UUID() PRIMARY KEY,
    application_id      VARCHAR(36) NOT NULL REFERENCES applications(id),
    worker_id           VARCHAR(36) NOT NULL REFERENCES worker_profiles(id),
    project_id          VARCHAR(36) NOT NULL REFERENCES projects(id),
    requirement_id      VARCHAR(36) NOT NULL REFERENCES workforce_requirements(id),
    role_title          VARCHAR(255),
    joining_date        DATE,
    expected_end_date   DATE,
    actual_end_date     DATE,
    daily_wage          DECIMAL(10,2),
    status              VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    notes               TEXT,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- EMPLOYMENT RECORDS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS employment_records (
    id                  VARCHAR(36) DEFAULT RANDOM_UUID() PRIMARY KEY,
    worker_id           VARCHAR(36) NOT NULL REFERENCES worker_profiles(id),
    project_id          VARCHAR(36) REFERENCES projects(id),
    deployment_id       VARCHAR(36) REFERENCES deployments(id),
    org_id              VARCHAR(36) REFERENCES organizations(id),
    role_title          VARCHAR(255),
    skill_used          VARCHAR(100),
    joining_date        DATE,
    end_date            DATE,
    days_worked         INTEGER DEFAULT 0,
    daily_wage          DECIMAL(10,2),
    total_wages_earned  DECIMAL(12,2),
    monthly_equivalent  DECIMAL(10,2),
    employment_status   VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    performance_rating  DECIMAL(3,2),
    exit_reason         TEXT,
    employer_feedback   TEXT,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TRAINING PROGRAMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS training_programs (
    id                  VARCHAR(36) DEFAULT RANDOM_UUID() PRIMARY KEY,
    org_id              VARCHAR(36) REFERENCES organizations(id),
    skill_category_id   VARCHAR(36) REFERENCES skill_categories(id),
    name                VARCHAR(500) NOT NULL,
    provider            VARCHAR(255),
    description         TEXT,
    duration_days       INTEGER,
    mode                VARCHAR(30) DEFAULT 'OFFLINE',
    location            VARCHAR(255),
    district            VARCHAR(100),
    capacity            INTEGER DEFAULT 30,
    cost                DECIMAL(10,2) DEFAULT 0,
    is_free             BOOLEAN NOT NULL DEFAULT TRUE,
    start_date          DATE,
    end_date            DATE,
    status              VARCHAR(30) NOT NULL DEFAULT 'UPCOMING',
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TRAINING ENROLLMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS training_enrollments (
    id                  VARCHAR(36) DEFAULT RANDOM_UUID() PRIMARY KEY,
    worker_id           VARCHAR(36) NOT NULL REFERENCES worker_profiles(id),
    program_id          VARCHAR(36) NOT NULL REFERENCES training_programs(id),
    enrollment_date     DATE NOT NULL DEFAULT CURRENT_DATE,
    progress_percent    INTEGER NOT NULL DEFAULT 0,
    attendance_percent  DECIMAL(5,2) DEFAULT 0,
    assessment_score    DECIMAL(5,2),
    completion_status   VARCHAR(30) NOT NULL DEFAULT 'ENROLLED',
    completion_date     DATE,
    certificate_number  VARCHAR(100),
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (worker_id, program_id)
);

-- ============================================================
-- CERTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS certifications (
    id                  VARCHAR(36) DEFAULT RANDOM_UUID() PRIMARY KEY,
    worker_id           VARCHAR(36) NOT NULL REFERENCES worker_profiles(id),
    skill_category_id   VARCHAR(36) REFERENCES skill_categories(id),
    certificate_name    VARCHAR(500) NOT NULL,
    certificate_number  VARCHAR(100) UNIQUE,
    issuing_org         VARCHAR(255),
    issue_date          DATE,
    expiry_date         DATE,
    verification_status VARCHAR(20) NOT NULL DEFAULT 'UNVERIFIED',
    verified_by_org_id  VARCHAR(36) REFERENCES organizations(id),
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MATCH SCORES TABLE (cached matching results)
-- ============================================================
CREATE TABLE IF NOT EXISTS match_scores (
    id                  VARCHAR(36) DEFAULT RANDOM_UUID() PRIMARY KEY,
    worker_id           VARCHAR(36) NOT NULL REFERENCES worker_profiles(id),
    requirement_id      VARCHAR(36) NOT NULL REFERENCES workforce_requirements(id),
    overall_score       DECIMAL(5,2) NOT NULL,
    skill_score         DECIMAL(5,2),
    experience_score    DECIMAL(5,2),
    verification_score  DECIMAL(5,2),
    availability_score  DECIMAL(5,2),
    rating_score        DECIMAL(5,2),
    wage_score          DECIMAL(5,2),
    match_reasons       TEXT,
    computed_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (worker_id, requirement_id)
);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id                  VARCHAR(36) DEFAULT RANDOM_UUID() PRIMARY KEY,
    user_id             VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type                VARCHAR(50) NOT NULL,
    title               VARCHAR(500) NOT NULL,
    message             TEXT,
    entity_type         VARCHAR(50),
    entity_id           VARCHAR(36),
    is_read             BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- AUDIT LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id          VARCHAR(36) DEFAULT RANDOM_UUID() PRIMARY KEY,
    user_id     VARCHAR(36) REFERENCES users(id),
    action      VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id   VARCHAR(36),
    old_value   TEXT,
    new_value   TEXT,
    ip_address  VARCHAR(45),
    metadata    TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_worker_profiles_district ON worker_profiles(district);
CREATE INDEX IF NOT EXISTS idx_worker_profiles_availability ON worker_profiles(availability_status);
CREATE INDEX IF NOT EXISTS idx_worker_profiles_verification ON worker_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_district ON projects(district);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_worker ON applications(worker_id);
CREATE INDEX IF NOT EXISTS idx_employment_status ON employment_records(employment_status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
