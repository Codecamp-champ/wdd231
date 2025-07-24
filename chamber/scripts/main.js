document.addEventListener('DOMContentLoaded', function() {
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const lastModifiedSpan = document.getElementById('last-modified');
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }

    const menuButton = document.getElementById('menu-button');
    const mainNav = document.getElementById('main-nav');

    if (menuButton && mainNav) {
        menuButton.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            menuButton.setAttribute('aria-expanded', mainNav.classList.contains('open'));
            menuButton.textContent = mainNav.classList.contains('open') ? '✕' : '☰';
        });
    }

    const path = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
        }
    });

    if (path === '' || path === 'index.html') {
        const homeLink = document.querySelector('nav ul li a[href="index.html"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }
});