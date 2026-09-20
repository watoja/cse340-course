const menuButton = document.querySelector("#menuButton");
const mainNavigation = document.querySelector("#mainNavigation");

if (menuButton && mainNavigation) {
    const toggleNavigation = () => {
        const isOpen = mainNavigation.classList.toggle("open");

        menuButton.setAttribute("aria-expanded", isOpen);

        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );
    };

    const closeNavigation = () => {
        mainNavigation.classList.remove("open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );
    };

    menuButton.addEventListener(
        "click",
        toggleNavigation
    );

    const navigationLinks =
        mainNavigation.querySelectorAll("a");

    navigationLinks.forEach((link) => {
        link.addEventListener(
            "click",
            closeNavigation
        );
    });
}