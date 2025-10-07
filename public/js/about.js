// Initialize navbar functionality for About page
document.addEventListener("DOMContentLoaded", function () {
    // Highlight current page in menu
    const currentPage = window.location.pathname.split("/").pop();
    const menuItems = document.querySelectorAll(".menu a");

    menuItems.forEach((item) => {
        if (item.getAttribute("href") === currentPage) {
            item.style.color = "var(--accent)";
            item.style.fontWeight = "600";
        }
    });

    // Initialize mobile menu and cart functionality
    initializePage();
});