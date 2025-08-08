import { setupNavToggle } from './nav.js';
import { updateFooter } from './footer.js';
import { getWeatherData } from './weather.js';
import { lazyLoadImages } from './lazyload.js'; // Import the new lazy-loading function

document.addEventListener('DOMContentLoaded', () => {
    setupNavToggle();
    updateFooter();
    getWeatherData();
    lazyLoadImages(); // Call the function to lazy-load images
});