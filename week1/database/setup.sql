/*
========================================================
CSE340 Community Service Projects Database
========================================================

Tables:
1. category
2. organization
3. project
4. project_categories

Relationships:
- One organization can have many projects.
- One project belongs to one organization.
- One project can have many categories.
- One category can belong to many projects.
- project_categories connects projects and categories.
*/


/*
========================================================
DROP EXISTING TABLES
========================================================
*/

DROP TABLE IF EXISTS project_categories CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS organization CASCADE;
DROP TABLE IF EXISTS category CASCADE;


/*
========================================================
CATEGORY TABLE
========================================================
*/

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);


/*
========================================================
ORGANIZATION TABLE
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
PROJECT TABLE
========================================================
*/

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    project_date DATE,
    location VARCHAR(150),
    volunteers_needed INTEGER DEFAULT 0,

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
PROJECT_CATEGORIES TABLE
========================================================

This is a junction table that connects projects
to categories.

A project can have multiple categories.
A category can belong to multiple projects.
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
CATEGORY SAMPLE DATA
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
ORGANIZATION SAMPLE DATA
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
PROJECT SAMPLE DATA
========================================================

There are 15 projects.

Organization 1:
Projects 1-5

Organization 2:
Projects 6-10

Organization 3:
Projects 11-15

This satisfies the requirement for at least
five projects for each organization.
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

/*
--------------------------------------------------------
UGANDA RED CROSS SOCIETY
organization_id = 1
--------------------------------------------------------
*/

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


/*
--------------------------------------------------------
UGANDA WILDLIFE AUTHORITY
organization_id = 2
--------------------------------------------------------
*/

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


/*
--------------------------------------------------------
REACH A HAND UGANDA
organization_id = 3
--------------------------------------------------------
*/

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
PROJECT_CATEGORIES SAMPLE DATA
========================================================

There are more than five rows here.

Projects can have more than one category.
*/

/*
Project 1 - Environmental
*/
INSERT INTO project_categories (project_id, category_id)
VALUES
(1, 1);

/*
Project 2 - Community Service
*/
INSERT INTO project_categories (project_id, category_id)
VALUES
(2, 3);

/*
Project 3 - Health and Wellness
*/
INSERT INTO project_categories (project_id, category_id)
VALUES
(3, 4);

/*
Project 4 - Health and Wellness
*/
INSERT INTO project_categories (project_id, category_id)
VALUES
(4, 4);

/*
Project 5 - Community Service
*/
INSERT INTO project_categories (project_id, category_id)
VALUES
(5, 3);

/*
Project 6 - Environmental
*/
INSERT INTO project_categories (project_id, category_id)
VALUES
(6, 1);

/*
Project 7 - Environmental
*/
INSERT INTO project_categories (project_id, category_id)
VALUES
(7, 1);

/*
Project 8 - Environmental
*/
INSERT INTO project_categories (project_id, category_id)
VALUES
(8, 1);

/*
Project 9 - Educational
*/
INSERT INTO project_categories (project_id, category_id)
VALUES
(9, 2);

/*
Project 10 - Environmental + Community Service
*/
INSERT INTO project_categories (project_id, category_id)
VALUES
(10, 1),
(10, 3);

/*
Project 11 - Educational
*/
INSERT INTO project_categories (project_id, category_id)
VALUES
(11, 2);

/*
Project 12 - Educational
*/
INSERT INTO project_categories (project_id, category_id)
VALUES
(12, 2);

/*
Project 13 - Health and Wellness
*/
INSERT INTO project_categories (project_id, category_id)
VALUES
(13, 4);

/*
Project 14 - Educational
*/
INSERT INTO project_categories (project_id, category_id)
VALUES
(14, 2);

/*
Project 15 - Community Service + Educational
*/
INSERT INTO project_categories (project_id, category_id)
VALUES
(15, 3),
(15, 2);


/*
========================================================
VERIFY THE DATA
========================================================
*/

SELECT
    organization_id,
    organization_name
FROM organization
ORDER BY organization_id;


SELECT
    organization.organization_name,
    COUNT(project.project_id) AS project_count
FROM organization
LEFT JOIN project
    ON organization.organization_id = project.organization_id
GROUP BY
    organization.organization_id,
    organization.organization_name
ORDER BY organization.organization_id;


SELECT
    COUNT(*) AS project_category_count
FROM project_categories;


SELECT
    project.project_name,
    organization.organization_name,
    category.category_name
FROM project
INNER JOIN organization
    ON project.organization_id = organization.organization_id
INNER JOIN project_categories
    ON project.project_id = project_categories.project_id
INNER JOIN category
    ON project_categories.category_id = category.category_id
ORDER BY project.project_id;