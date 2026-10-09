
/*
========================================================
CSE340 COMMUNITY SERVICE PROJECTS DATABASE
========================================================

Tables:
1. roles
2. users
3. category
4. organization
5. project
6. project_categories

IMPORTANT:
This is a development database reset script.
It drops existing tables and deletes their data.

Do not run this script against production data
that you need to preserve.
========================================================
*/


/*
========================================================
1. DROP EXISTING TABLES
========================================================
*/

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

DROP TABLE IF EXISTS project_categories CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS organization CASCADE;
DROP TABLE IF EXISTS category CASCADE;


/*
========================================================
2. ROLES TABLE
========================================================
*/

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);


/*
========================================================
3. INITIAL ROLES
========================================================
*/

INSERT INTO roles (
    role_name,
    role_description
)
VALUES
(
    'user',
    'Standard user with basic access'
),
(
    'admin',
    'Administrator with permission to manage users'
);


/*
========================================================
4. USERS TABLE
========================================================
*/

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
        ON DELETE RESTRICT,

    CONSTRAINT users_name_not_blank
        CHECK (LENGTH(TRIM(name)) > 0),

    CONSTRAINT users_email_not_blank
        CHECK (LENGTH(TRIM(email)) > 0),

    CONSTRAINT users_password_hash_not_blank
        CHECK (LENGTH(TRIM(password_hash)) > 0)
);


/*
========================================================
5. CATEGORY TABLE
========================================================
*/

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);


/*
========================================================
6. CATEGORY SAMPLE DATA
========================================================
*/

INSERT INTO category (
    category_name,
    description
)
VALUES
(
    'Environmental',
    'Projects that protect and improve the natural environment.'
),
(
    'Educational',
    'Projects that support learning, teaching, and educational development.'
),
(
    'Community Service',
    'Projects that improve communities and support local residents.'
),
(
    'Health and Wellness',
    'Projects that promote health, wellness, and healthy living.'
);


/*
========================================================
7. ORGANIZATION TABLE
========================================================
*/

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    organization_name VARCHAR(150) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    website VARCHAR(255),
    contact_email VARCHAR(150),
    phone VARCHAR(50),
    location VARCHAR(150),
    image VARCHAR(255)
);


/*
========================================================
8. ORGANIZATION SAMPLE DATA
========================================================
*/

INSERT INTO organization (
    organization_name,
    description,
    website,
    contact_email,
    phone,
    location,
    image
)
VALUES
(
    'Uganda Red Cross Society',
    'An organization supporting communities through humanitarian services, emergency response, health programs, and disaster preparedness.',
    'https://www.redcrossug.org/',
    'info@redcrossug.org',
    '+256 312 264 000',
    'Kampala, Uganda',
    'redcross.jpg'
),
(
    'Uganda Wildlife Authority',
    'An organization responsible for conserving wildlife and managing protected areas in Uganda.',
    'https://ugandawildlife.org/',
    'info@ugandawildlife.org',
    '+256 414 355 000',
    'Kampala, Uganda',
    'uwa.jpg'
),
(
    'Reach A Hand Uganda',
    'An organization working with young people through health education, leadership, and community development programs.',
    'https://www.reachahand.org/',
    'info@reachahand.org',
    '+256 414 692 000',
    'Kampala, Uganda',
    'reach.jpg'
);


/*
========================================================
9. PROJECT TABLE
========================================================
*/

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    project_date DATE,
    location VARCHAR(150),
    volunteers_needed INTEGER NOT NULL DEFAULT 0,

    organization_id INTEGER NOT NULL,

    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE,

    CONSTRAINT volunteers_needed_check
        CHECK (volunteers_needed >= 0)
);


/*
========================================================
10. PROJECT SAMPLE DATA
========================================================

15 projects:
- Projects 1-5 belong to Uganda Red Cross Society.
- Projects 6-10 belong to Uganda Wildlife Authority.
- Projects 11-15 belong to Reach A Hand Uganda.
========================================================
*/

INSERT INTO project (
    project_name,
    description,
    project_date,
    location,
    volunteers_needed,
    organization_id
)
VALUES

/* UGANDA RED CROSS SOCIETY */

(
    'Community Tree Planting',
    'Volunteers help plant trees and educate community members about environmental conservation.',
    '2026-10-05',
    'Kampala',
    25,
    1
),
(
    'Community Cleanup Day',
    'Volunteers work with community members to clean public spaces and improve sanitation.',
    '2026-10-12',
    'Kampala',
    30,
    1
),
(
    'First Aid Training',
    'Volunteers support community first aid awareness and basic emergency response training.',
    '2026-10-19',
    'Entebbe',
    20,
    1
),
(
    'Health Awareness Campaign',
    'Volunteers participate in community health education and awareness activities.',
    '2026-10-26',
    'Mukono',
    25,
    1
),
(
    'Emergency Preparedness Workshop',
    'Volunteers help families and communities learn about emergency preparedness and disaster response.',
    '2026-11-02',
    'Jinja',
    20,
    1
),

/* UGANDA WILDLIFE AUTHORITY */

(
    'Wildlife Conservation Outreach',
    'Volunteers educate communities about wildlife conservation and responsible environmental practices.',
    '2026-11-09',
    'Kampala',
    20,
    2
),
(
    'Wetland Restoration Project',
    'Volunteers help restore wetland areas and promote environmental protection.',
    '2026-11-16',
    'Wakiso',
    30,
    2
),
(
    'Forest Conservation Day',
    'Volunteers participate in activities that support forest conservation and environmental awareness.',
    '2026-11-23',
    'Mabira',
    35,
    2
),
(
    'Wildlife Education Workshop',
    'Volunteers help students learn about Uganda wildlife and the importance of conservation.',
    '2026-11-30',
    'Fort Portal',
    20,
    2
),
(
    'Community Conservation Campaign',
    'Volunteers work with local communities to promote wildlife protection and sustainable practices.',
    '2026-12-07',
    'Kasese',
    25,
    2
),

/* REACH A HAND UGANDA */

(
    'Youth Education Workshop',
    'Volunteers support young people through educational activities and life skills training.',
    '2026-12-14',
    'Kampala',
    25,
    3
),
(
    'Student Mentoring Program',
    'Volunteers mentor students and help them develop educational and personal goals.',
    '2026-12-21',
    'Kampala',
    20,
    3
),
(
    'Youth Health Awareness Day',
    'Volunteers support young people with health education and wellness information.',
    '2027-01-09',
    'Mbarara',
    25,
    3
),
(
    'Leadership Skills Workshop',
    'Volunteers help young people develop leadership, communication, and teamwork skills.',
    '2027-01-16',
    'Jinja',
    20,
    3
),
(
    'Community Youth Service Day',
    'Young people and volunteers work together on projects that strengthen their local community.',
    '2027-01-23',
    'Wakiso',
    30,
    3
);


/*
========================================================
11. PROJECT_CATEGORIES JUNCTION TABLE
========================================================
*/

CREATE TABLE project_categories (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project_categories_project
        FOREIGN KEY (project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_project_categories_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);


/*
========================================================
12. PROJECT CATEGORY ASSIGNMENTS
========================================================
*/

INSERT INTO project_categories (
    project_id,
    category_id
)
VALUES
(1, 1),
(2, 3),
(3, 4),
(4, 4),
(5, 3),
(6, 1),
(7, 1),
(8, 1),
(9, 2),
(10, 1),
(10, 3),
(11, 2),
(12, 2),
(13, 4),
(14, 2),
(15, 3),
(15, 2);


/*
========================================================
13. VERIFY ROLES
========================================================
*/

SELECT
    role_id,
    role_name,
    role_description
FROM roles
ORDER BY role_id;


/*
========================================================
14. VERIFY REGISTERED USERS
========================================================
*/

SELECT
    u.user_id,
    u.name,
    u.email,
    r.role_name AS role,
    u.created_at
FROM users AS u
INNER JOIN roles AS r
    ON u.role_id = r.role_id
ORDER BY u.user_id;


/*
========================================================
15. VERIFY ORGANIZATIONS
========================================================
*/

SELECT
    organization_id,
    organization_name
FROM organization
ORDER BY organization_id;


/*
========================================================
16. VERIFY PROJECT COUNT PER ORGANIZATION
========================================================
*/

SELECT
    o.organization_name,
    COUNT(p.project_id) AS project_count
FROM organization AS o
LEFT JOIN project AS p
    ON o.organization_id = p.organization_id
GROUP BY
    o.organization_id,
    o.organization_name
ORDER BY o.organization_id;


/*
========================================================
17. VERIFY PROJECT CATEGORY COUNT
========================================================
*/

SELECT
    COUNT(*) AS project_category_count
FROM project_categories;


/*
========================================================
18. VERIFY PROJECTS, ORGANIZATIONS, AND CATEGORIES
========================================================
*/

SELECT
    p.project_id,
    p.project_name,
    o.organization_name,
    c.category_name
FROM project AS p
INNER JOIN organization AS o
    ON p.organization_id = o.organization_id
INNER JOIN project_categories AS pc
    ON p.project_id = pc.project_id
INNER JOIN category AS c
    ON pc.category_id = c.category_id
ORDER BY
    p.project_id,
    c.category_name;