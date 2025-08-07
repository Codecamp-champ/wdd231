const weatherDataSource = 'data/weather.json';

/**
 * Calculates the wind chill factor based on temperature and wind speed.
 * @param {number} temp - Air temperature in degrees Celsius.
 * @param {number} wind - Wind speed in km/h.
 * @returns {string} - The calculated wind chill in °C, or 'N/A' if conditions are not met.
 */
function calculateWindChill(temp, wind) {
    // Viable Wind Chill Calculation Conditions (Metric):
    // Temperature must be <= 10 °C (50°F)
    // Wind speed must be > 4.8 km/h (3 mph)
    if (temp <= 10 && wind > 4.8) {
        // Metric Wind Chill Formula (Environment Canada / J.E. Osczevski formula)
        // Twc = 13.12 + 0.6215Ta - 11.37V^0.16 + 0.3965TaV^0.16
        // Ta = air temperature in degrees Celsius
        // V = wind speed in km/h
        const windChill = 13.12 + (0.6215 * temp) - (11.37 * Math.pow(wind, 0.16)) + (0.3965 * temp * Math.pow(wind, 0.16));
        return `${windChill.toFixed(1)} °C`;
    } else {
        return 'N/A';
    }
}

/**
 * Fetches weather data from a local JSON file and displays it on the page.
 * Includes error handling for the fetch operation.
 */
export async function fetchAndDisplayWeather() {
    try {
        const response = await fetch(weatherDataSource);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const weatherData = await response.json();
        
        // Populate the weather section with data
        const tempElement = document.getElementById('temperature-value');
        const windSpeedElement = document.getElementById('windspeed-value');
        const windChillElement = document.getElementById('windchill-value');

        if (tempElement) tempElement.textContent = `${weatherData.temperature}°C`;
        if (windSpeedElement) windSpeedElement.textContent = `${weatherData.windSpeed} km/h`;

        // Calculate and display windchill
        const windChillResult = calculateWindChill(weatherData.temperature, weatherData.windSpeed);
        if (windChillElement) windChillElement.textContent = windChillResult;

    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        // Display a user-friendly error message on the page
        const weatherSection = document.getElementById('weather');
        if (weatherSection) {
            weatherSection.innerHTML = `<h2>Current Weather</h2><p>Failed to load weather data. Please try again later.</p><p>Error: ${error.message}</p>`;
        }
    }
}