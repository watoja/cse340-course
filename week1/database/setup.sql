-- ============================================================
-- CSE340 Service Projects Database
-- File: database/setup.sql
-- ============================================================

-- ------------------------------------------------------------
-- 1. Remove existing tables
-- ------------------------------------------------------------
-- CASCADE removes dependent foreign-key relationships.
-- This makes the script safe to run again during development.

DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS organization CASCADE;
DROP TABLE IF EXISTS category CASCADE;


-- ------------------------------------------------------------
-- 2. Create category table
-- ------------------------------------------------------------

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);


-- ------------------------------------------------------------
-- 3. Create organization table
-- ------------------------------------------------------------

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    organization_name VARCHAR(150) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    website VARCHAR(255),
    contact_email VARCHAR(150),
    phone VARCHAR(30),
    location VARCHAR(150),
    image VARCHAR(255)
);


-- ------------------------------------------------------------
-- 4. Create project table
-- ------------------------------------------------------------

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    project_date DATE,
    location VARCHAR(150),
    volunteers_needed INTEGER DEFAULT 0,

    organization_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_project_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE RESTRICT,

    CONSTRAINT check_volunteers_needed
        CHECK (volunteers_needed >= 0)
);


-- ------------------------------------------------------------
-- 5. Insert categories
-- ------------------------------------------------------------

INSERT INTO category (
    category_name,
    description
)
VALUES
(
    'Environmental',
    'Projects focused on protecting the environment, conservation, tree planting, and community cleanup.'
),
(
    'Educational',
    'Projects that provide education, mentoring, training, and learning opportunities.'
),
(
    'Community Service',
    'Projects that support communities through service activities and local improvement efforts.'
),
(
    'Health and Wellness',
    'Projects that promote health awareness, wellness, and healthy communities.'
);


-- ------------------------------------------------------------
-- 6. Insert organizations
-- ------------------------------------------------------------

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
    'A humanitarian organization that supports communities through disaster response, health programs, first aid, and community development.',
    'https://www.redcrossug.org/',
    'info@redcrossug.org',
    '+256 312 260 001',
    'Kampala, Uganda',
    'redcross.jpg'
),
(
    'Uganda Wildlife Authority',
    'An organization responsible for managing and conserving Uganda''s wildlife and protected areas.',
    'https://ugandawildlife.org/',
    'info@ugandawildlife.org',
    '+256 414 355 000',
    'Kampala, Uganda',
    'uwa.jpg'
),
(
    'Reach A Hand Uganda',
    'An organization that works with young people through health education, leadership, mentorship, and community engagement.',
    'https://reachahand.org/',
    'info@reachahand.org',
    '+256 393 266 229',
    'Kampala, Uganda',
    'reach.jpg'
);


-- ------------------------------------------------------------
-- 7. Insert service projects
-- ------------------------------------------------------------

INSERT INTO project (
    project_name,
    description,
    project_date,
    location,
    volunteers_needed,
    organization_id,
    category_id
)
VALUES
(
    'Community Tree Planting',
    'Volunteers will help plant trees and educate community members about environmental conservation.',
    '2026-10-03',
    'Kampala, Uganda',
    30,
    (
        SELECT organization_id
        FROM organization
        WHERE organization_name = 'Uganda Wildlife Authority'
    ),
    (
        SELECT category_id
        FROM category
        WHERE category_name = 'Environmental'
    )
),
(
    'Community Cleanup Day',
    'Volunteers will work together to clean public spaces and promote responsible waste management.',
    '2026-10-10',
    'Kampala, Uganda',
    40,
    (
        SELECT organization_id
        FROM organization
        WHERE organization_name = 'Uganda Red Cross Society'
    ),
    (
        SELECT category_id
        FROM category
        WHERE category_name = 'Community Service'
    )
),
(
    'Youth Education Workshop',
    'Volunteers will support a youth education workshop focused on personal development, learning, and career preparation.',
    '2026-10-17',
    'Kampala, Uganda',
    20,
    (
        SELECT organization_id
        FROM organization
        WHERE organization_name = 'Reach A Hand Uganda'
    ),
    (
        SELECT category_id
        FROM category
        WHERE category_name = 'Educational'
    )
),
(
    'Health Awareness Campaign',
    'Volunteers will help provide health information and promote healthy habits in the community.',
    '2026-10-24',
    'Kampala, Uganda',
    25,
    (
        SELECT organization_id
        FROM organization
        WHERE organization_name = 'Uganda Red Cross Society'
    ),
    (
        SELECT category_id
        FROM category
        WHERE category_name = 'Health and Wellness'
    )
),
(
    'Wildlife Conservation Outreach',
    'Volunteers will participate in an educational outreach program about wildlife conservation and protected areas.',
    '2026-10-31',
    'Kampala, Uganda',
    15,
    (
        SELECT organization_id
        FROM organization
        WHERE organization_name = 'Uganda Wildlife Authority'
    ),
    (
        SELECT category_id
        FROM category
        WHERE category_name = 'Environmental'
    )
),
(
    'Student Mentoring Program',
    'Volunteers will mentor students and encourage educational and personal development.',
    '2026-11-07',
    'Kampala, Uganda',
    18,
    (
        SELECT organization_id
        FROM organization
        WHERE organization_name = 'Reach A Hand Uganda'
    ),
    (
        SELECT category_id
        FROM category
        WHERE category_name = 'Educational'
    )
);


-- ------------------------------------------------------------
-- 8. Verify the inserted data
-- ------------------------------------------------------------

SELECT *
FROM category
ORDER BY category_id;

SELECT *
FROM organization
ORDER BY organization_id;

SELECT *
FROM project
ORDER BY project_id;


-- ------------------------------------------------------------
-- 9. Verify the relationships
-- ------------------------------------------------------------

SELECT
    p.project_id,
    p.project_name,
    c.category_name,
    o.organization_name,
    p.project_date,
    p.location,
    p.volunteers_needed
FROM project AS p
INNER JOIN category AS c
    ON p.category_id = c.category_id
INNER JOIN organization AS o
    ON p.organization_id = o.organization_id
ORDER BY p.project_date, p.project_name;