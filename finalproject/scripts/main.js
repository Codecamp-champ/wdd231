import { setupNavToggle } from './nav.js';
import { updateFooter } from './footer.js';
import { getWeatherData } from './weather.js';

document.addEventListener('DOMContentLoaded', () => {
    setupNavToggle();
    updateFooter();
    getWeatherData();
});