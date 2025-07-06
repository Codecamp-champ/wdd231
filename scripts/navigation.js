document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navigation = document.getElementById('main-nav');

    if (hamburgerBtn && navigation) {
        hamburgerBtn.addEventListener('click', () => {
            const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
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

        navigation.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    navigation.classList.remove('open');
                    hamburgerBtn.setAttribute('aria-expanded', 'false');
                    navigation.style.maxHeight = "0";
                    navigation.style.opacity = 0;
                }
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                navigation.classList.remove('open');
                navigation.style.maxHeight = 'none';
                navigation.style.opacity = 1;
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            } else {
                if (navigation.classList.contains('open')) {
                    navigation.style.maxHeight = navigation.scrollHeight + "px";
                    navigation.style.opacity = 1;
                }
            }
        });

        hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
});