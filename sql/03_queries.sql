-- Example queries for reports and DBMS coursework

-- 1) Alumni count by graduation year
SELECT graduation_year, COUNT(*) AS alumni_count
FROM alumni
GROUP BY graduation_year
ORDER BY graduation_year DESC;

-- 2) Alumni by department with degree breakdown
SELECT
    d.name AS department,
    dp.level,
    COUNT(*) AS cnt
FROM alumni a
JOIN department d ON d.id = a.department_id
JOIN degree_program dp ON dp.id = a.degree_program_id
GROUP BY d.name, dp.level
ORDER BY d.name, dp.level;

-- 3) Current employers (distinct) and how many alumni work there
SELECT e.employer, COUNT(DISTINCT e.alumni_id) AS alumni_employed
FROM employment e
WHERE e.is_current = 1
GROUP BY e.employer
ORDER BY alumni_employed DESC, e.employer;

-- 4) Alumni who registered for an event but attendance not yet recorded
SELECT v.full_name, ev.title, er.registered_at
FROM event_registration er
JOIN event ev ON ev.id = er.event_id
JOIN v_alumni_directory v ON v.id = er.alumni_id
WHERE er.attended IS NULL
ORDER BY ev.starts_at, v.last_name;

-- 5) Total donations per alumni (lifetime giving); use one currency per row if data is mixed
SELECT
    a.first_name || ' ' || a.last_name AS donor,
    SUM(d.amount) AS total_given,
    MAX(d.currency) AS currency
FROM donation d
JOIN alumni a ON a.id = d.alumni_id
GROUP BY d.alumni_id, a.first_name, a.last_name
ORDER BY total_given DESC;

-- 6) Alumni with no employment on file (data quality check)
SELECT v.*
FROM v_alumni_directory v
LEFT JOIN employment e ON e.alumni_id = v.id
WHERE e.id IS NULL;
