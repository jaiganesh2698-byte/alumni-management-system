-- Alumni Management System — core schema (SQLite; portable SQL)
-- Load order: 01_schema.sql → 02_seed.sql → 03_queries.sql (optional)

PRAGMA foreign_keys = ON;

-- Academic structure
CREATE TABLE degree_program (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    code            TEXT NOT NULL UNIQUE,
    name            TEXT NOT NULL,
    level           TEXT NOT NULL CHECK (level IN ('Certificate', 'Diploma', 'Bachelor', 'Master', 'Doctorate')),
    duration_years  INTEGER CHECK (duration_years IS NULL OR duration_years > 0)
);

CREATE TABLE department (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    code        TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL
);

-- Alumni master record
CREATE TABLE alumni (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id_legacy   TEXT UNIQUE,
    first_name          TEXT NOT NULL,
    last_name           TEXT NOT NULL,
    email               TEXT NOT NULL UNIQUE,
    phone               TEXT,
    graduation_year     INTEGER NOT NULL CHECK (graduation_year BETWEEN 1950 AND 2100),
    degree_program_id   INTEGER NOT NULL REFERENCES degree_program (id),
    department_id       INTEGER NOT NULL REFERENCES department (id),
    city                TEXT,
    country             TEXT,
    consent_contact     INTEGER NOT NULL DEFAULT 1 CHECK (consent_contact IN (0, 1)),
    notes               TEXT,
    created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_alumni_graduation_year ON alumni (graduation_year);
CREATE INDEX idx_alumni_department ON alumni (department_id);
CREATE INDEX idx_alumni_degree ON alumni (degree_program_id);
CREATE INDEX idx_alumni_name ON alumni (last_name, first_name);

-- Employment history (current job: end_date IS NULL and is_current = 1)
CREATE TABLE employment (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    alumni_id   INTEGER NOT NULL REFERENCES alumni (id) ON DELETE CASCADE,
    employer    TEXT NOT NULL,
    job_title   TEXT NOT NULL,
    start_date  TEXT NOT NULL,
    end_date    TEXT,
    is_current  INTEGER NOT NULL DEFAULT 0 CHECK (is_current IN (0, 1)),
    CHECK (
        (is_current = 1 AND end_date IS NULL)
        OR (is_current = 0)
    )
);

CREATE INDEX idx_employment_alumni ON employment (alumni_id);
CREATE INDEX idx_employment_current ON employment (alumni_id, is_current);

-- Events (reunions, career talks)
CREATE TABLE event (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    event_type  TEXT NOT NULL CHECK (event_type IN ('Reunion', 'Networking', 'Career', 'Fundraising', 'Other')),
    starts_at   TEXT NOT NULL,
    location    TEXT,
    description TEXT
);

CREATE TABLE event_registration (
    alumni_id       INTEGER NOT NULL REFERENCES alumni (id) ON DELETE CASCADE,
    event_id        INTEGER NOT NULL REFERENCES event (id) ON DELETE CASCADE,
    registered_at   TEXT NOT NULL DEFAULT (datetime('now')),
    attended        INTEGER CHECK (attended IS NULL OR attended IN (0, 1)),
    PRIMARY KEY (alumni_id, event_id)
);

CREATE INDEX idx_registration_event ON event_registration (event_id);

-- Donations (optional fundraising)
CREATE TABLE donation (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    alumni_id   INTEGER NOT NULL REFERENCES alumni (id) ON DELETE RESTRICT,
    amount      REAL NOT NULL CHECK (amount > 0),
    currency    TEXT NOT NULL DEFAULT 'USD',
    donated_at  TEXT NOT NULL DEFAULT (date('now')),
    campaign    TEXT
);

CREATE INDEX idx_donation_alumni ON donation (alumni_id);
CREATE INDEX idx_donation_date ON donation (donated_at);

-- Reporting views
CREATE VIEW v_alumni_directory AS
SELECT
    a.id,
    a.student_id_legacy,
    a.first_name || ' ' || a.last_name AS full_name,
    a.email,
    a.graduation_year,
    dp.name AS degree_name,
    d.name  AS department_name,
    a.city,
    a.country
FROM alumni a
JOIN degree_program dp ON dp.id = a.degree_program_id
JOIN department d ON d.id = a.department_id;

CREATE VIEW v_current_employment AS
SELECT
    a.id AS alumni_id,
    a.first_name || ' ' || a.last_name AS full_name,
    e.employer,
    e.job_title,
    e.start_date
FROM alumni a
JOIN employment e ON e.alumni_id = a.id
WHERE e.is_current = 1;
