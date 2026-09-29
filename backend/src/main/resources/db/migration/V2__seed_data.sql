-- NirmaanSetu - V2 Demo Seed Data
-- Maharashtra-focused coherent demo dataset for SIH demonstration
-- All passwords: NirmaanSetu@2024
-- BCrypt hash of NirmaanSetu@2024 (verified bcrypt $2a$12 hash)

-- ============================================================
-- SKILL CATEGORIES
-- ============================================================
INSERT INTO skill_categories (id, code, name, description, sector) VALUES
('sc-001', 'MASONRY', 'Masonry & Stone Work', 'Brick laying, stone masonry, plastering, tiling', 'Construction'),
('sc-002', 'ELECTRICAL', 'Electrical Work', 'Wiring, panel work, switchgear, lighting installation', 'Electrical'),
('sc-003', 'PLUMBING', 'Plumbing & Pipework', 'Water supply, drainage, pipe fitting, sanitation', 'Plumbing'),
('sc-004', 'CARPENTRY', 'Carpentry & Woodwork', 'Furniture making, door/window fitting, shuttering', 'Construction'),
('sc-005', 'WELDING', 'Welding & Fabrication', 'Arc welding, MIG, TIG, structural steel fabrication', 'Industrial'),
('sc-006', 'PAINTING', 'Painting & Finishing', 'Wall painting, surface preparation, waterproofing', 'Construction'),
('sc-007', 'CONCRETE', 'Concrete & RCC Work', 'Concrete mixing, pouring, reinforcement binding', 'Construction'),
('sc-008', 'ROAD_WORK', 'Road Construction', 'Bitumen laying, road repair, earthwork, compaction', 'Infrastructure'),
('sc-009', 'SCAFFOLDING', 'Scaffolding & Safety', 'Scaffolding erection, safety equipment, height work', 'Construction'),
('sc-010', 'SUPERVISION', 'Site Supervision', 'Work supervision, quality control, crew management', 'Management'),
('sc-011', 'SOLAR', 'Solar Panel Installation', 'PV panel installation, wiring, inverter setup', 'Renewable Energy'),
('sc-012', 'HVAC', 'HVAC & Mechanical', 'AC installation, ventilation, mechanical work', 'Mechanical');

-- ============================================================
-- LOCATIONS
-- ============================================================
INSERT INTO locations (id, state, district, city, pincode, latitude, longitude) VALUES
('loc-001', 'Maharashtra', 'Pune', 'Pune', '411001', 18.5204, 73.8567),
('loc-002', 'Maharashtra', 'Mumbai', 'Mumbai', '400001', 19.0760, 72.8777),
('loc-003', 'Maharashtra', 'Nashik', 'Nashik', '422001', 19.9975, 73.7898),
('loc-004', 'Maharashtra', 'Nagpur', 'Nagpur', '440001', 21.1458, 79.0882),
('loc-005', 'Maharashtra', 'Aurangabad', 'Aurangabad', '431001', 19.8762, 75.3433),
('loc-006', 'Maharashtra', 'Solapur', 'Solapur', '413001', 17.6868, 75.9064),
('loc-007', 'Maharashtra', 'Kolhapur', 'Kolhapur', '416001', 16.6936, 74.2421),
('loc-008', 'Maharashtra', 'Amravati', 'Amravati', '444601', 20.9320, 77.7523),
('loc-009', 'Maharashtra', 'Thane', 'Thane', '400601', 19.2183, 72.9781),
('loc-010', 'Maharashtra', 'Satara', 'Satara', '415001', 17.6805, 74.0183);

-- ============================================================
-- USERS (all passwords: NirmaanSetu@2024)
-- BCrypt: $2a$12$1puQERbzCtJGAF2VbilYkeaq8IWqacxS4KQK1NBULZsyLWTSvIeXy
-- ============================================================
-- Admin
INSERT INTO users (id, username, email, phone, password_hash, full_name, role, is_active, is_verified) VALUES
('u-admin-001', 'admin', 'admin@nirmaansetu.mah.gov.in', '+919900000001',
 '$2a$12$1puQERbzCtJGAF2VbilYkeaq8IWqacxS4KQK1NBULZsyLWTSvIeXy',
 'Platform Administrator', 'ADMIN', true, true);

-- Government Officers
INSERT INTO users (id, username, email, phone, password_hash, full_name, role, is_active, is_verified) VALUES
('u-govt-001', 'govt.pune', 'seei.pune@mah.gov.in', '+919900000002',
 '$2a$12$1puQERbzCtJGAF2VbilYkeaq8IWqacxS4KQK1NBULZsyLWTSvIeXy',
 'Dy. Secretary Skills Dept - Pune', 'GOVERNMENT', true, true),
('u-govt-002', 'govt.nagpur', 'seei.nagpur@mah.gov.in', '+919900000003',
 '$2a$12$1puQERbzCtJGAF2VbilYkeaq8IWqacxS4KQK1NBULZsyLWTSvIeXy',
 'Regional Director Skills - Nagpur', 'GOVERNMENT', true, true);

-- Project Agencies
INSERT INTO users (id, username, email, phone, password_hash, full_name, role, is_active, is_verified) VALUES
('u-agency-001', 'agency.mhada', 'projects@mhada-infra.com', '+919900000004',
 '$2a$12$1puQERbzCtJGAF2VbilYkeaq8IWqacxS4KQK1NBULZsyLWTSvIeXy',
 'MHADA Infrastructure Projects', 'PROJECT_AGENCY', true, true),
('u-agency-002', 'agency.nmmc', 'projects@nmmc-build.com', '+919900000005',
 '$2a$12$1puQERbzCtJGAF2VbilYkeaq8IWqacxS4KQK1NBULZsyLWTSvIeXy',
 'Navi Mumbai Municipal Council', 'PROJECT_AGENCY', true, true);

-- Training Organizations
INSERT INTO users (id, username, email, phone, password_hash, full_name, role, is_active, is_verified) VALUES
('u-training-001', 'training.itipune', 'director@iti-pune.edu.in', '+919900000006',
 '$2a$12$1puQERbzCtJGAF2VbilYkeaq8IWqacxS4KQK1NBULZsyLWTSvIeXy',
 'Principal ITI Pune', 'TRAINING_ORGANIZATION', true, true),
('u-training-002', 'training.skillindia', 'info@skillindia-mah.org', '+919900000007',
 '$2a$12$1puQERbzCtJGAF2VbilYkeaq8IWqacxS4KQK1NBULZsyLWTSvIeXy',
 'Skill India Maharashtra Partner', 'TRAINING_ORGANIZATION', true, true);

-- Workers
INSERT INTO users (id, username, email, phone, password_hash, full_name, role, is_active, is_verified) VALUES
('u-worker-001', 'ramesh.kumar', 'ramesh.kumar@gmail.com', '+919800000001',
 '$2a$12$1puQERbzCtJGAF2VbilYkeaq8IWqacxS4KQK1NBULZsyLWTSvIeXy',
 'Ramesh Kumar', 'WORKER', true, true),
('u-worker-002', 'suresh.patil', 'suresh.patil@gmail.com', '+919800000002',
 '$2a$12$1puQERbzCtJGAF2VbilYkeaq8IWqacxS4KQK1NBULZsyLWTSvIeXy',
 'Suresh Patil', 'WORKER', true, true),
('u-worker-003', 'priya.devi', 'priya.devi@gmail.com', '+919800000003',
 '$2a$12$1puQERbzCtJGAF2VbilYkeaq8IWqacxS4KQK1NBULZsyLWTSvIeXy',
 'Priya Devi', 'WORKER', true, true),
('u-worker-004', 'arvind.sharma', 'arvind.sharma@gmail.com', '+919800000004',
 '$2a$12$1puQERbzCtJGAF2VbilYkeaq8IWqacxS4KQK1NBULZsyLWTSvIeXy',
 'Arvind Sharma', 'WORKER', true, true),
('u-worker-005', 'sunita.jadhav', 'sunita.jadhav@gmail.com', '+919800000005',
 '$2a$12$1puQERbzCtJGAF2VbilYkeaq8IWqacxS4KQK1NBULZsyLWTSvIeXy',
 'Sunita Jadhav', 'WORKER', true, true),
('u-worker-006', 'manoj.singh', 'manoj.singh@gmail.com', '+919800000006',
 '$2a$12$1puQERbzCtJGAF2VbilYkeaq8IWqacxS4KQK1NBULZsyLWTSvIeXy',
 'Manoj Singh', 'WORKER', true, true),
('u-worker-007', 'kavita.more', 'kavita.more@gmail.com', '+919800000007',
 '$2a$12$1puQERbzCtJGAF2VbilYkeaq8IWqacxS4KQK1NBULZsyLWTSvIeXy',
 'Kavita More', 'WORKER', true, true),
('u-worker-008', 'deepak.yadav', 'deepak.yadav@gmail.com', '+919800000008',
 '$2a$12$1puQERbzCtJGAF2VbilYkeaq8IWqacxS4KQK1NBULZsyLWTSvIeXy',
 'Deepak Yadav', 'WORKER', true, true);

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
INSERT INTO organizations (id, user_id, org_name, org_type, registration_number, state, district, city, contact_person, contact_email, contact_phone, verification_status) VALUES
('org-govt-001', 'u-govt-001', 'Maharashtra State Skills Dept - Pune Division', 'GOVERNMENT', 'MAH-SEEI-PUNE-001', 'Maharashtra', 'Pune', 'Pune', 'Dy. Secretary Ramakrishna', 'seei.pune@mah.gov.in', '+919900000002', 'VERIFIED'),
('org-govt-002', 'u-govt-002', 'Maharashtra State Skills Dept - Nagpur Division', 'GOVERNMENT', 'MAH-SEEI-NGP-001', 'Maharashtra', 'Nagpur', 'Nagpur', 'Regional Director Kulkarni', 'seei.nagpur@mah.gov.in', '+919900000003', 'VERIFIED'),
('org-agency-001', 'u-agency-001', 'MHADA Infrastructure Projects Pvt Ltd', 'PROJECT_AGENCY', 'CIN-U45200MH2018PTC045123', 'Maharashtra', 'Pune', 'Pune', 'Project Director Mehta', 'projects@mhada-infra.com', '+919900000004', 'VERIFIED'),
('org-agency-002', 'u-agency-002', 'Navi Mumbai Municipal Council Works', 'PROJECT_AGENCY', 'NMMC-WORKS-001', 'Maharashtra', 'Thane', 'Navi Mumbai', 'Chief Engineer Deshmukh', 'projects@nmmc-build.com', '+919900000005', 'VERIFIED'),
('org-training-001', 'u-training-001', 'Government ITI Pune', 'TRAINING_ORGANIZATION', 'MSDE-ITI-PUNE-001', 'Maharashtra', 'Pune', 'Pune', 'Principal Dr. Joshi', 'director@iti-pune.edu.in', '+919900000006', 'VERIFIED'),
('org-training-002', 'u-training-002', 'Skill India Maharashtra - NSDC Partner', 'TRAINING_ORGANIZATION', 'NSDC-MH-TP-45892', 'Maharashtra', 'Nashik', 'Nashik', 'Director Kadam', 'info@skillindia-mah.org', '+919900000007', 'VERIFIED');

-- ============================================================
-- WORKER PROFILES
-- ============================================================
INSERT INTO worker_profiles (id, user_id, location_id, worker_code, full_name, phone, gender, date_of_birth, state, district, city, pincode, latitude, longitude, primary_skill, experience_years, aadhaar_verified, expected_daily_wage, expected_monthly_wage, availability_status, verification_status, verified_by_org_id, rating, projects_completed, profile_completion) VALUES
('wp-001', 'u-worker-001', 'loc-001', 'WRK-MH-PUNE-2024-001', 'Ramesh Kumar', '+919800000001', 'MALE', '1988-06-15', 'Maharashtra', 'Pune', 'Pune', '411001', 18.5204, 73.8567, 'Masonry & Stone Work', 8.5, true, 850.00, 22100.00, 'AVAILABLE', 'VERIFIED', 'org-agency-001', 4.20, 12, 90),
('wp-002', 'u-worker-002', 'loc-001', 'WRK-MH-PUNE-2024-002', 'Suresh Patil', '+919800000002', 'MALE', '1990-03-22', 'Maharashtra', 'Pune', 'Pune', '411002', 18.5104, 73.8467, 'Electrical Work', 6.0, true, 950.00, 24700.00, 'DEPLOYED', 'VERIFIED', 'org-agency-001', 4.50, 8, 85),
('wp-003', 'u-worker-003', 'loc-003', 'WRK-MH-NSK-2024-001', 'Priya Devi', '+919800000003', 'FEMALE', '1992-09-10', 'Maharashtra', 'Nashik', 'Nashik', '422001', 19.9975, 73.7898, 'Painting & Finishing', 4.0, true, 700.00, 18200.00, 'AVAILABLE', 'VERIFIED', 'org-training-001', 3.80, 5, 80),
('wp-004', 'u-worker-004', 'loc-004', 'WRK-MH-NGP-2024-001', 'Arvind Sharma', '+919800000004', 'MALE', '1985-12-01', 'Maharashtra', 'Nagpur', 'Nagpur', '440001', 21.1458, 79.0882, 'Plumbing & Pipework', 10.0, true, 800.00, 20800.00, 'AVAILABLE', 'VERIFIED', 'org-govt-002', 4.70, 15, 95),
('wp-005', 'u-worker-005', 'loc-002', 'WRK-MH-MUM-2024-001', 'Sunita Jadhav', '+919800000005', 'FEMALE', '1993-07-18', 'Maharashtra', 'Mumbai', 'Mumbai', '400001', 19.0760, 72.8777, 'Concrete & RCC Work', 5.5, false, 780.00, 20280.00, 'IN_TRAINING', 'PENDING', null, 3.50, 6, 70),
('wp-006', 'u-worker-006', 'loc-005', 'WRK-MH-AUR-2024-001', 'Manoj Singh', '+919800000006', 'MALE', '1987-04-25', 'Maharashtra', 'Aurangabad', 'Aurangabad', '431001', 19.8762, 75.3433, 'Welding & Fabrication', 9.0, true, 900.00, 23400.00, 'AVAILABLE', 'VERIFIED', 'org-agency-002', 4.30, 11, 88),
('wp-007', 'u-worker-007', 'loc-006', 'WRK-MH-SLP-2024-001', 'Kavita More', '+919800000007', 'FEMALE', '1995-01-30', 'Maharashtra', 'Solapur', 'Solapur', '413001', 17.6868, 75.9064, 'Solar Panel Installation', 3.0, true, 750.00, 19500.00, 'AVAILABLE', 'VERIFIED', 'org-training-002', 4.10, 4, 82),
('wp-008', 'u-worker-008', 'loc-009', 'WRK-MH-THN-2024-001', 'Deepak Yadav', '+919800000008', 'MALE', '1991-11-08', 'Maharashtra', 'Thane', 'Thane', '400601', 19.2183, 72.9781, 'Road Construction', 7.0, true, 820.00, 21320.00, 'AVAILABLE', 'VERIFIED', 'org-govt-001', 4.00, 9, 85);

-- ============================================================
-- WORKER SKILLS
-- ============================================================
INSERT INTO worker_skills (id, worker_id, skill_category_id, skill_level, experience_months, is_primary, is_verified, certificate_number) VALUES
('ws-001', 'wp-001', 'sc-001', 'EXPERT', 102, true, true, 'MSME-MAS-2018-4521'),
('ws-002', 'wp-001', 'sc-007', 'SKILLED', 60, false, true, null),
('ws-003', 'wp-002', 'sc-002', 'SKILLED', 72, true, true, 'ITI-ELEC-2020-8834'),
('ws-004', 'wp-002', 'sc-011', 'SEMI_SKILLED', 24, false, false, null),
('ws-005', 'wp-003', 'sc-006', 'SKILLED', 48, true, true, null),
('ws-006', 'wp-003', 'sc-001', 'SEMI_SKILLED', 18, false, false, null),
('ws-007', 'wp-004', 'sc-003', 'EXPERT', 120, true, true, 'MSME-PLMB-2015-2234'),
('ws-008', 'wp-004', 'sc-009', 'SKILLED', 36, false, true, null),
('ws-009', 'wp-005', 'sc-007', 'SKILLED', 66, true, false, null),
('ws-010', 'wp-005', 'sc-001', 'SEMI_SKILLED', 24, false, false, null),
('ws-011', 'wp-006', 'sc-005', 'EXPERT', 108, true, true, 'NCVT-WELD-2016-5512'),
('ws-012', 'wp-006', 'sc-004', 'SKILLED', 48, false, false, null),
('ws-013', 'wp-007', 'sc-011', 'SKILLED', 36, true, true, 'NSDC-SOLAR-2022-7891'),
('ws-014', 'wp-007', 'sc-002', 'SEMI_SKILLED', 18, false, false, null),
('ws-015', 'wp-008', 'sc-008', 'SKILLED', 84, true, true, 'MORD-ROAD-2019-3312'),
('ws-016', 'wp-008', 'sc-007', 'SKILLED', 36, false, false, null);

-- ============================================================
-- PROJECTS
-- ============================================================
INSERT INTO projects (id, project_code, title, description, org_id, assigned_agency_id, sector, budget, state, district, city, location_id, start_date, estimated_end_date, status, created_by) VALUES
('proj-001', 'PRJ-MH-PUNE-ROAD-2024-001', 'Pune Ring Road - Phase 2 Construction', 'Construction of 18km ring road connecting Hinjewadi IT hub to Wakad junction with 6 overpasses and 3 major bridges under PMC urban development scheme', 'org-govt-001', 'org-agency-001', 'Roads & Bridges', 85000000.00, 'Maharashtra', 'Pune', 'Pune', 'loc-001', '2024-11-01', '2025-09-30', 'IN_PROGRESS', 'u-govt-001'),
('proj-002', 'PRJ-MH-MUM-DRAIN-2024-001', 'Mumbai Storm Water Drain Expansion - Zone 4', 'Expansion and rehabilitation of 12km storm water drain network in Zone 4 (Kurla-Mankhurd corridor) to prevent monsoon flooding', 'org-govt-001', 'org-agency-002', 'Water & Sanitation', 42000000.00, 'Maharashtra', 'Mumbai', 'Mumbai', 'loc-002', '2024-10-15', '2025-05-31', 'IN_PROGRESS', 'u-govt-001'),
('proj-003', 'PRJ-MH-NSK-SOLAR-2024-001', 'Nashik District Solar Street Lighting - 500 Units', 'Installation of 500 solar street lights across 12 villages in Nashik district under PM-KUSUM scheme extension', 'org-govt-002', null, 'Renewable Energy', 18500000.00, 'Maharashtra', 'Nashik', 'Nashik', 'loc-003', '2025-01-15', '2025-06-30', 'APPROVED', 'u-govt-002'),
('proj-004', 'PRJ-MH-NGP-WATER-2024-001', 'Nagpur Smart Water Grid Phase 1', 'Installation of IoT-enabled smart water meters and pipeline network upgrade across 8 wards of Nagpur Municipal Corporation', 'org-govt-002', null, 'Water & Sanitation', 32000000.00, 'Maharashtra', 'Nagpur', 'Nagpur', 'loc-004', '2025-02-01', '2025-10-31', 'PROPOSED', 'u-govt-002'),
('proj-005', 'PRJ-MH-AUR-BUILD-2024-001', 'Aurangabad Affordable Housing - Block B', 'Construction of 200 affordable housing units under PM Awas Yojana in Aurangabad satellite township', 'org-agency-001', 'org-agency-001', 'Housing', 55000000.00, 'Maharashtra', 'Aurangabad', 'Aurangabad', 'loc-005', '2024-09-01', '2025-12-31', 'IN_PROGRESS', 'u-agency-001');

-- ============================================================
-- WORKFORCE REQUIREMENTS
-- ============================================================
INSERT INTO workforce_requirements (id, project_id, skill_category_id, skill_level, workers_needed, workers_filled, daily_wage_min, daily_wage_max, daily_wage_offered, experience_months_min, certification_required, start_date, duration_days, status) VALUES
-- Pune Ring Road requirements
('wr-001', 'proj-001', 'sc-001', 'SKILLED', 40, 8, 700.00, 900.00, 800.00, 36, false, '2024-11-01', 300, 'OPEN'),
('wr-002', 'proj-001', 'sc-008', 'SKILLED', 30, 5, 750.00, 950.00, 850.00, 48, false, '2024-11-01', 300, 'OPEN'),
('wr-003', 'proj-001', 'sc-007', 'SEMI_SKILLED', 25, 3, 650.00, 800.00, 700.00, 24, false, '2024-11-15', 270, 'OPEN'),
('wr-004', 'proj-001', 'sc-005', 'SKILLED', 15, 2, 800.00, 1000.00, 900.00, 36, true, '2024-11-01', 300, 'OPEN'),
-- Mumbai Drain requirements
('wr-005', 'proj-002', 'sc-003', 'SKILLED', 35, 12, 750.00, 950.00, 850.00, 48, false, '2024-10-15', 230, 'OPEN'),
('wr-006', 'proj-002', 'sc-001', 'SKILLED', 20, 4, 700.00, 880.00, 780.00, 24, false, '2024-10-15', 230, 'OPEN'),
('wr-007', 'proj-002', 'sc-002', 'SEMI_SKILLED', 10, 3, 800.00, 1000.00, 900.00, 24, true, '2024-10-20', 210, 'PARTIALLY_FILLED'),
-- Nashik Solar requirements
('wr-008', 'proj-003', 'sc-011', 'SKILLED', 25, 0, 700.00, 900.00, 800.00, 24, true, '2025-01-15', 165, 'OPEN'),
('wr-009', 'proj-003', 'sc-002', 'SEMI_SKILLED', 15, 0, 700.00, 850.00, 750.00, 18, false, '2025-01-15', 165, 'OPEN'),
-- Nagpur Smart Water
('wr-010', 'proj-004', 'sc-003', 'EXPERT', 20, 0, 900.00, 1100.00, 1000.00, 72, true, '2025-02-01', 270, 'OPEN'),
('wr-011', 'proj-004', 'sc-002', 'SKILLED', 15, 0, 850.00, 1050.00, 950.00, 48, true, '2025-02-01', 270, 'OPEN'),
-- Aurangabad Housing
('wr-012', 'proj-005', 'sc-001', 'SKILLED', 50, 15, 700.00, 880.00, 780.00, 36, false, '2024-09-01', 480, 'OPEN'),
('wr-013', 'proj-005', 'sc-004', 'SKILLED', 20, 6, 750.00, 920.00, 820.00, 24, false, '2024-09-01', 480, 'OPEN'),
('wr-014', 'proj-005', 'sc-006', 'SEMI_SKILLED', 15, 3, 600.00, 780.00, 680.00, 12, false, '2024-10-01', 420, 'OPEN');

-- ============================================================
-- APPLICATIONS
-- ============================================================
INSERT INTO applications (id, worker_id, project_id, requirement_id, status, match_score, applied_at, reviewed_at, shortlisted_at, selected_at) VALUES
('app-001', 'wp-001', 'proj-001', 'wr-001', 'SELECTED', 87.50, '2024-11-02 09:30:00', '2024-11-03 14:00:00', '2024-11-04 10:00:00', '2024-11-05 11:00:00'),
('app-002', 'wp-004', 'proj-002', 'wr-005', 'DEPLOYED', 91.20, '2024-10-16 10:15:00', '2024-10-17 09:00:00', '2024-10-18 10:00:00', '2024-10-19 11:00:00'),
('app-003', 'wp-002', 'proj-002', 'wr-007', 'DEPLOYED', 84.30, '2024-10-17 11:00:00', '2024-10-18 09:30:00', '2024-10-19 10:30:00', '2024-10-20 12:00:00'),
('app-004', 'wp-006', 'proj-001', 'wr-004', 'SHORTLISTED', 78.60, '2024-11-03 08:45:00', '2024-11-05 14:30:00', '2024-11-07 11:00:00', null),
('app-005', 'wp-008', 'proj-001', 'wr-002', 'APPLIED', 82.10, '2024-11-10 14:20:00', null, null, null),
('app-006', 'wp-003', 'proj-005', 'wr-014', 'APPLIED', 74.50, '2024-09-15 10:00:00', null, null, null),
('app-007', 'wp-007', 'proj-003', 'wr-008', 'APPLIED', 88.90, '2025-01-16 09:00:00', null, null, null),
('app-008', 'wp-005', 'proj-005', 'wr-012', 'REJECTED', 52.30, '2024-09-10 11:00:00', '2024-09-12 10:00:00', null, null);

-- ============================================================
-- DEPLOYMENTS
-- ============================================================
INSERT INTO deployments (id, application_id, worker_id, project_id, requirement_id, role_title, joining_date, expected_end_date, daily_wage, status) VALUES
('dep-001', 'app-002', 'wp-004', 'proj-002', 'wr-005', 'Senior Plumber', '2024-10-21', '2025-05-31', 850.00, 'ACTIVE'),
('dep-002', 'app-003', 'wp-002', 'proj-002', 'wr-007', 'Electrician', '2024-10-22', '2025-05-20', 900.00, 'ACTIVE');

-- ============================================================
-- EMPLOYMENT RECORDS
-- ============================================================
INSERT INTO employment_records (id, worker_id, project_id, deployment_id, org_id, role_title, skill_used, joining_date, end_date, days_worked, daily_wage, total_wages_earned, monthly_equivalent, employment_status, performance_rating) VALUES
-- Active deployments
('er-001', 'wp-004', 'proj-002', 'dep-001', 'org-agency-002', 'Senior Plumber', 'Plumbing & Pipework', '2024-10-21', null, 145, 850.00, 123250.00, 22100.00, 'ACTIVE', 4.70),
('er-002', 'wp-002', 'proj-002', 'dep-002', 'org-agency-002', 'Electrician', 'Electrical Work', '2024-10-22', null, 144, 900.00, 129600.00, 23400.00, 'ACTIVE', 4.50),
-- Completed past records (for history and analytics)
('er-003', 'wp-001', 'proj-005', null, 'org-agency-001', 'Mason', 'Masonry & Stone Work', '2024-01-10', '2024-08-31', 230, 800.00, 184000.00, 20800.00, 'COMPLETED', 4.20),
('er-004', 'wp-006', 'proj-001', null, 'org-agency-001', 'Welder', 'Welding & Fabrication', '2023-06-01', '2024-02-28', 265, 880.00, 233200.00, 22880.00, 'COMPLETED', 4.30),
('er-005', 'wp-008', 'proj-001', null, 'org-agency-001', 'Road Layer', 'Road Construction', '2023-08-15', '2024-03-30', 220, 820.00, 180400.00, 21320.00, 'COMPLETED', 4.00),
('er-006', 'wp-003', 'proj-005', null, 'org-agency-001', 'Painter', 'Painting & Finishing', '2023-09-01', '2024-01-31', 125, 680.00, 85000.00, 17680.00, 'COMPLETED', 3.80);

-- ============================================================
-- TRAINING PROGRAMS
-- ============================================================
INSERT INTO training_programs (id, org_id, skill_category_id, name, provider, description, duration_days, mode, location, district, capacity, cost, is_free, start_date, end_date, status) VALUES
('tp-001', 'org-training-001', 'sc-001', 'Advanced Masonry & RCC Work', 'Government ITI Pune', 'Comprehensive training on modern masonry techniques, RCC work, and earthquake-resistant construction', 45, 'OFFLINE', 'ITI Campus, Shivajinagar', 'Pune', 30, 0, true, '2024-12-01', '2025-01-15', 'COMPLETED'),
('tp-002', 'org-training-002', 'sc-011', 'Solar PV Installation & Maintenance', 'Skill India Maharashtra', 'NSDC-certified training for solar panel installation, wiring, and maintenance under PM-KUSUM', 30, 'OFFLINE', 'Nashik Industrial Area', 'Nashik', 25, 0, true, '2024-11-01', '2024-11-30', 'COMPLETED'),
('tp-003', 'org-training-001', 'sc-002', 'Advanced Electrical Wiring & Safety', 'Government ITI Pune', 'ITI-certified training covering LT/HT wiring, industrial panels, and electrical safety standards', 60, 'OFFLINE', 'ITI Campus, Shivajinagar', 'Pune', 35, 0, true, '2025-01-20', '2025-03-20', 'ACTIVE'),
('tp-004', 'org-training-002', 'sc-003', 'Plumbing & Sanitation - Advanced', 'Skill India Maharashtra', 'Modern plumbing techniques, water conservation, and sanitation systems under SBM-Urban', 30, 'OFFLINE', 'Nagpur Training Center', 'Nagpur', 20, 0, true, '2025-02-15', '2025-03-15', 'UPCOMING'),
('tp-005', 'org-training-001', 'sc-005', 'Advanced Welding - MIG/TIG', 'Government ITI Pune', 'Advanced welding certification for structural steel fabrication and industrial applications', 45, 'OFFLINE', 'ITI Campus, Shivajinagar', 'Pune', 25, 0, true, '2025-03-01', '2025-04-15', 'UPCOMING');

-- ============================================================
-- TRAINING ENROLLMENTS
-- ============================================================
INSERT INTO training_enrollments (id, worker_id, program_id, enrollment_date, progress_percent, attendance_percent, assessment_score, completion_status, completion_date, certificate_number) VALUES
('te-001', 'wp-001', 'tp-001', '2024-12-01', 100, 95.5, 88.0, 'COMPLETED', '2025-01-15', 'ITI-MAS-ADV-2025-0045'),
('te-002', 'wp-007', 'tp-002', '2024-11-01', 100, 98.0, 92.5, 'COMPLETED', '2024-11-30', 'NSDC-SOLAR-2024-7832'),
('te-003', 'wp-003', 'tp-002', '2024-11-01', 100, 90.0, 79.0, 'COMPLETED', '2024-11-30', 'NSDC-SOLAR-2024-7833'),
('te-004', 'wp-005', 'tp-003', '2025-01-20', 55, 88.0, null, 'IN_PROGRESS', null, null),
('te-005', 'wp-006', 'tp-005', '2025-03-01', 10, 85.0, null, 'ENROLLED', null, null);

-- ============================================================
-- CERTIFICATIONS
-- ============================================================
INSERT INTO certifications (id, worker_id, skill_category_id, certificate_name, certificate_number, issuing_org, issue_date, expiry_date, verification_status, verified_by_org_id) VALUES
('cert-001', 'wp-001', 'sc-001', 'MSME Masonry Skill Certificate - Level 4', 'MSME-MAS-2018-4521', 'MSME Toolroom & Training Centre', '2018-08-15', '2023-08-15', 'VERIFIED', 'org-agency-001'),
('cert-002', 'wp-001', 'sc-001', 'Advanced Masonry & RCC - ITI Pune', 'ITI-MAS-ADV-2025-0045', 'Government ITI Pune', '2025-01-15', '2030-01-15', 'VERIFIED', 'org-training-001'),
('cert-003', 'wp-002', 'sc-002', 'ITI Electrician Trade Certificate', 'ITI-ELEC-2020-8834', 'Government ITI Pune', '2020-06-30', '2025-06-30', 'VERIFIED', 'org-training-001'),
('cert-004', 'wp-004', 'sc-003', 'MSME Plumbing Skill Certificate - Level 5', 'MSME-PLMB-2015-2234', 'MSME Toolroom', '2015-11-20', '2025-11-20', 'VERIFIED', 'org-govt-002'),
('cert-005', 'wp-006', 'sc-005', 'NCVT Welder Certificate - Structural Steel', 'NCVT-WELD-2016-5512', 'National Council for Vocational Training', '2016-09-10', '2026-09-10', 'VERIFIED', 'org-agency-002'),
('cert-006', 'wp-007', 'sc-011', 'NSDC Solar PV Installer Certificate', 'NSDC-SOLAR-2024-7832', 'Skill India Maharashtra', '2024-11-30', '2029-11-30', 'VERIFIED', 'org-training-002'),
('cert-007', 'wp-008', 'sc-008', 'MORD Road Construction Certificate', 'MORD-ROAD-2019-3312', 'Ministry of Rural Development', '2019-05-15', '2024-05-15', 'VERIFIED', 'org-govt-001');

-- ============================================================
-- NOTIFICATIONS (initial set)
-- ============================================================
INSERT INTO notifications (id, user_id, type, title, message, entity_type, entity_id, is_read) VALUES
('notif-001', 'u-worker-001', 'APPLICATION_SELECTED', 'You have been selected!', 'Congratulations! You have been selected for the Pune Ring Road project as Mason. Please report to site on scheduled date.', 'APPLICATION', 'app-001', false),
('notif-002', 'u-worker-004', 'DEPLOYMENT_ACTIVE', 'Deployment Active', 'Your deployment at Mumbai Storm Water Drain project is active. Daily wage: ₹850.', 'DEPLOYMENT', 'dep-001', true),
('notif-003', 'u-worker-007', 'TRAINING_COMPLETED', 'Training Completed - Certificate Awarded', 'You have successfully completed Solar PV Installation training. Certificate No: NSDC-SOLAR-2024-7832', 'TRAINING_ENROLLMENT', 'te-002', false),
('notif-004', 'u-worker-005', 'TRAINING_ENROLLED', 'Training in Progress', 'Your Electrical Wiring training is ongoing. Current progress: 55%. Keep it up!', 'TRAINING_ENROLLMENT', 'te-004', false),
('notif-005', 'u-worker-008', 'APPLICATION_RECEIVED', 'Application Received', 'Your application for Pune Ring Road - Road Construction has been received and is under review.', 'APPLICATION', 'app-005', true);
