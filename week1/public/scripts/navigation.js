
/*
=========================================================
COMMUNITY SERVICE PROJECTS
RESPONSIVE NAVIGATION
=========================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector("#menuButton");
    const mainNavigation = document.querySelector("#mainNavigation");

    if (!menuButton || !mainNavigation) {
        console.error(
            "Navigation error: #menuButton or #mainNavigation was not found."
        );
        return;
    }

    const desktopScreen = window.matchMedia("(min-width: 768px)");

    /*
    ---------------------------------------------------------
    CLOSE MOBILE NAVIGATION
    ---------------------------------------------------------
    */

    const closeNavigation = () => {
        mainNavigation.classList.remove("open");

        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );
    };

    /*
    ---------------------------------------------------------
    TOGGLE NAVIGATION
    ---------------------------------------------------------
    */

    const toggleNavigation = () => {
        if (desktopScreen.matches) {
            closeNavigation();
            return;
        }

        const isOpen = mainNavigation.classList.toggle("open");

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );
    };

    menuButton.addEventListener("click", toggleNavigation);

    /*
    ---------------------------------------------------------
    CLOSE AFTER SELECTING A LINK ON MOBILE
    ---------------------------------------------------------
    */

    mainNavigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            if (!desktopScreen.matches) {
                closeNavigation();
            }
        });
    });

    /*
    ---------------------------------------------------------
    CLOSE WHEN ESCAPE IS PRESSED
    ---------------------------------------------------------
    */

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            mainNavigation.classList.contains("open")
        ) {
            closeNavigation();
            menuButton.focus();
        }
    });

    /*
    ---------------------------------------------------------
    RESET NAVIGATION WHEN SWITCHING TO DESKTOP
    ---------------------------------------------------------
    */

    desktopScreen.addEventListener("change", (event) => {
        if (event.matches) {
            closeNavigation();
        }
    });

    console.info("Navigation script loaded successfully.");
});