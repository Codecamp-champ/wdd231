import { setupNavToggle } from './nav.js';
import { setupFooter } from './footer.js';
import { fetchAndDisplayWeather } from './weather.js';

document.addEventListener('DOMContentLoaded', () => {
    setupNavToggle();
    setupFooter();

    if (document.getElementById('weather-display')) {
        fetchAndDisplayWeather();
    }
});