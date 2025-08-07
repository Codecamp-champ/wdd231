import { setupNavToggle } from './nav.js';
import { setupFooter } from './footer.js';
import { fetchAndDisplayWeather } from './weather.js';

document.addEventListener('DOMContentLoaded', () => {
    // Setup general UI components
    setupNavToggle();
    setupFooter();

    // Only fetch and display weather on the index.html page
    if (document.getElementById('weather')) {
        fetchAndDisplayWeather();
    }
});