-- Sample data for development and demos

INSERT INTO degree_program (code, name, level, duration_years) VALUES
    ('BSC-CS', 'B.Sc. Computer Science', 'Bachelor', 4),
    ('MSC-DS', 'M.Sc. Data Science', 'Master', 2),
    ('PHD-EE', 'Ph.D. Electrical Engineering', 'Doctorate', NULL);

INSERT INTO department (code, name) VALUES
    ('CS', 'Computer Science'),
    ('EE', 'Electrical Engineering'),
    ('BUS', 'Business Administration');

INSERT INTO alumni (
    student_id_legacy, first_name, last_name, email, phone,
    graduation_year, degree_program_id, department_id, city, country, consent_contact
) VALUES
    ('U2018001', 'Priya', 'Nair', 'priya.nair@example.com', '+1-555-0101', 2018, 1, 1, 'Chennai', 'India', 1),
    ('U2019007', 'James', 'Okafor', 'j.okafor@example.com', '+1-555-0102', 2019, 1, 1, 'Toronto', 'Canada', 1),
    ('G2021003', 'Mei', 'Tan', 'mei.tan@example.com', NULL, 2021, 2, 1, 'Singapore', 'Singapore', 1),
    ('P2020001', 'Elena', 'Volkov', 'elena.volkov@example.com', '+1-555-0104', 2020, 3, 2, 'Berlin', 'Germany', 0),
    ('U2017033', 'Carlos', 'Silva', 'carlos.silva@example.com', '+1-555-0105', 2017, 1, 3, 'São Paulo', 'Brazil', 1);

INSERT INTO employment (alumni_id, employer, job_title, start_date, end_date, is_current) VALUES
    (1, 'Acme Analytics', 'Software Engineer', '2018-07-01', '2021-03-15', 0),
    (1, 'Northwind Labs', 'Senior Engineer', '2021-04-01', NULL, 1),
    (2, 'Contoso Health', 'Data Analyst', '2019-09-01', NULL, 1),
    (3, 'Fabrikam AI', 'ML Engineer', '2021-06-01', NULL, 1),
    (4, 'Research Institute Z', 'Postdoctoral Researcher', '2020-10-01', NULL, 1),
    (5, 'Adventure Works', 'Product Manager', '2017-08-01', '2022-12-31', 0),
    (5, 'Wide World Importers', 'Director of Operations', '2023-01-15', NULL, 1);

INSERT INTO event (title, event_type, starts_at, location, description) VALUES
    ('Class of 2018 Reunion', 'Reunion', '2026-06-14 18:00:00', 'Main Campus Hall', 'Ten-year reunion dinner.'),
    ('Alumni Tech Career Panel', 'Career', '2026-03-05 17:30:00', 'Virtual (Zoom)', 'Panel with engineers and founders.'),
    ('Annual Giving Day', 'Fundraising', '2026-09-20 00:00:00', 'Online', '24-hour fundraising campaign.');

INSERT INTO event_registration (alumni_id, event_id, attended) VALUES
    (1, 1, NULL),
    (2, 1, NULL),
    (2, 2, 1),
    (3, 2, 1),
    (5, 3, NULL);

INSERT INTO donation (alumni_id, amount, currency, donated_at, campaign) VALUES
    (1, 250.00, 'USD', '2025-11-01', 'Annual Fund'),
    (2, 100.00, 'USD', '2025-11-02', 'Annual Fund'),
    (5, 500.00, 'USD', '2026-09-20', 'Giving Day 2026');
