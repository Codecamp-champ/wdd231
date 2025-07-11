document.addEventListener('DOMContentLoaded', function() {
    // Current Year for Footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Last Modified Date for Footer
    const lastModifiedSpan = document.getElementById('last-modified');
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }

    // Mobile Navigation Toggle
    const menuButton = document.getElementById('menu-button');
    const mainNav = document.getElementById('main-nav');

    if (menuButton && mainNav) {
        menuButton.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            menuButton.textContent = mainNav.classList.contains('open') ? '✕' : '☰';
        });
    }

    // Highlight active navigation link
    const path = window.location.pathname.split('/').pop(); // Get current page filename
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
        }
    });
});