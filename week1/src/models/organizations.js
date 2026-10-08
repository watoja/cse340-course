import db from "./db.js";


const DEFAULT_ORGANIZATION_IMAGE =
    "placeholder-logo.png";


const getAllOrganizations = async () => {
    const sql = `
        SELECT
            organization_id,
            organization_name,
            description,
            website,
            contact_email,
            phone,
            location,
            image
        FROM organization
        ORDER BY organization_name;
    `;

    const result = await db.query(sql);

    return result.rows;
};


const getOrganizationById = async (
    organizationId
) => {
    const sql = `
        SELECT
            organization_id,
            organization_name,
            description,
            website,
            contact_email,
            phone,
            location,
            image
        FROM organization
        WHERE organization_id = $1;
    `;

    const result = await db.query(
        sql,
        [organizationId]
    );

    return result.rows[0];
};


const createOrganization = async (
    organization
) => {
    const sql = `
        INSERT INTO organization (
            organization_name,
            description,
            website,
            contact_email,
            phone,
            location,
            image
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
        )
        RETURNING
            organization_id,
            organization_name;
    `;

    const values = [
        organization.organization_name?.trim(),
        organization.description?.trim(),
        organization.website?.trim() || null,
        organization.contact_email?.trim() || null,
        organization.phone?.trim() || null,
        organization.location?.trim() || null,
        DEFAULT_ORGANIZATION_IMAGE
    ];

    console.log(
        "ORGANIZATION INSERT VALUES:",
        values
    );

    const result = await db.query(
        sql,
        values
    );

    console.log(
        "ORGANIZATION INSERT RESULT:",
        result.rows[0]
    );

    return result.rows[0];
};


const updateOrganization = async (
    organizationId,
    organization
) => {
    const sql = `
        UPDATE organization
        SET
            organization_name = $1,
            description = $2,
            website = $3,
            contact_email = $4,
            phone = $5,
            location = $6,
            image = $7
        WHERE organization_id = $8
        RETURNING
            organization_id,
            organization_name,
            description,
            website,
            contact_email,
            phone,
            location,
            image;
    `;

    const values = [
        organization.organization_name?.trim(),
        organization.description?.trim(),
        organization.website?.trim() || null,
        organization.contact_email?.trim() || null,
        organization.phone?.trim() || null,
        organization.location?.trim() || null,
        organization.image?.trim() ||
            DEFAULT_ORGANIZATION_IMAGE,
        Number(organizationId)
    ];

    console.log(
        "UPDATE ORGANIZATION ID:",
        organizationId
    );

    console.log(
        "UPDATE VALUES:",
        values
    );

    const result = await db.query(
        sql,
        values
    );

    console.log(
        "UPDATE ORGANIZATION RESULT:",
        result.rows[0]
    );

    return result.rows[0];
};


export {
    getAllOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization
};