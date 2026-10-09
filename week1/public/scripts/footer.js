
/*
========================================================
COMMUNITY SERVICE PROJECTS
FOOTER SCRIPT
========================================================
Responsibilities:
- Display the current year.
- Display the document's last-modified date.
========================================================
*/

const currentYearElement = document.getElementById("currentYear");
const lastModifiedElement = document.getElementById("lastModified");

if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

if (lastModifiedElement) {
    const lastModifiedDate = new Date(document.lastModified);

    lastModifiedElement.textContent =
        Number.isNaN(lastModifiedDate.getTime())
            ? "Unavailable"
            : lastModifiedDate.toLocaleString();
}

