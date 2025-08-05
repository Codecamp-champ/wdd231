document.addEventListener('DOMContentLoaded', () => {
    const lastModified = document.getElementById('last-modified');
    if (lastModified) {
        lastModified.textContent = document.lastModified;
    }

    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    const menuButton = document.getElementById('menu-button');
    const mainNav = document.getElementById('main-nav');
    if (menuButton && mainNav) {
        menuButton.addEventListener('click', () => {
            mainNav.classList.toggle('open');
        });
    }
});