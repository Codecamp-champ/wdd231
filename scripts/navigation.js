document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.querySelector('.hamburger-menu'); // Changed to class selector
    const navigation = document.getElementById('main-nav'); // Changed to ID selector

    if (hamburgerBtn && navigation) {
        hamburgerBtn.addEventListener('click', () => {
            const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';

            // Toggle the 'open' class
            navigation.classList.toggle('open');
            hamburgerBtn.setAttribute('aria-expanded', !isExpanded);

            if (navigation.classList.contains('open')) {
                navigation.style.maxHeight = navigation.scrollHeight + "px";
                navigation.style.opacity = 1;
            } else {
                navigation.style.maxHeight = "0";
                navigation.style.opacity = 0;
            }
        });

        // Optional: Close nav when a link is clicked (for single-page sites or if desired)
        navigation.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) { // Only close on small screens
                    navigation.classList.remove('open');
                    hamburgerBtn.setAttribute('aria-expanded', 'false');
                    navigation.style.maxHeight = "0";
                    navigation.style.opacity = 0;
                }
            });
        });

        // Handle window resize to adjust nav state (for desktop vs mobile view)
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                navigation.classList.remove('open'); // Ensure it's not "open" in mobile state
                navigation.style.maxHeight = 'none'; // Allow CSS to control height naturally
                navigation.style.opacity = 1;
                hamburgerBtn.setAttribute('aria-expanded', 'false'); // Reset aria-expanded
            } else {
                // On mobile, if nav was open, set max-height dynamically
                if (navigation.classList.contains('open')) {
                    navigation.style.maxHeight = navigation.scrollHeight + "px";
                    navigation.style.opacity = 1;
                }
            }
        });

        // Set initial aria-expanded state
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
});