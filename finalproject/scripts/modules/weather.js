const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=64.96&lon=-19.02&units=metric&appid=YOUR_API_KEY';

/**
 * Asynchronously fetches weather data from the OpenWeatherMap API and updates the DOM.
 */
export async function fetchWeatherData() {
    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        updateWeatherDisplay(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('temperature-value').textContent = 'N/A';
        document.getElementById('conditions-value').textContent = 'N/A';
        document.getElementById('windspeed-value').textContent = 'N/A';
        document.getElementById('windchill-value').textContent = 'N/A';
    }
}

/**
 * Updates the weather display with fetched data and calculates wind chill.
 * @param {object} data - The weather data object from the API.
 */
function updateWeatherDisplay(data) {
    const temp = data.main.temp;
    const windSpeed = data.wind.speed;
    const conditions = data.weather[0].description;
    
    document.getElementById('temperature-value').textContent = `${temp.toFixed(1)}°C`;
    document.getElementById('conditions-value').textContent = conditions;
    document.getElementById('windspeed-value').textContent = `${windSpeed.toFixed(1)} km/h`;

    const windChill = calculateWindChill(temp, windSpeed);
    document.getElementById('windchill-value').textContent = windChill === null ? 'N/A' : `${windChill.toFixed(1)}°C`;
}

/**
 * Calculates the wind chill factor based on temperature and wind speed.
 * @param {number} temp - The temperature in Celsius.
 * @param {number} windSpeed - The wind speed in km/h.
 * @returns {number|null} The wind chill in Celsius or null if conditions are not met.
 */
export function calculateWindChill(temp, windSpeed) {
    if (temp <= 10 && windSpeed > 4.8) {
        // Wind chill formula for Celsius and km/h
        return 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temp * Math.pow(windSpeed, 0.16);
    }
    return null;
}