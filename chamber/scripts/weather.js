const WEATHER_API_KEY = '2d7a0b25d9910e4763e5868f0c50f3d2';
const LATITUDE = 49.5044;
const LONGITUDE = -115.7725;

async function getWeatherData() {
    const weatherDisplay = document.getElementById("weather-display");
    if (!weatherDisplay) return;

    // Fetch current weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${WEATHER_API_KEY}&units=imperial`;

    // Fetch 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${WEATHER_API_KEY}&units=imperial`;

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('One or more API responses were not successful.');
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayWeatherData(currentData, forecastData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherDisplay.innerHTML = "<p>Could not load weather data. Please check your API key and network connection.</p>";
    }
}

function displayWeatherData(currentData, forecastData) {
    const weatherDisplay = document.getElementById("weather-display");
    if (!weatherDisplay) return;

    const currentTemp = currentData.main.temp.toFixed(0);
    const weatherDescription = currentData.weather[0].description;
    const weatherIconCode = currentData.weather[0].icon;
    const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}.png`;

    const dailyForecasts = forecastData.list.filter(item => item.dt_txt.includes('12:00:00'));

    const forecastCardsHtml = dailyForecasts.slice(0, 3).map(daily => {
        const forecastDate = new Date(daily.dt * 1000);
        const dayOfWeek = forecastDate.toLocaleDateString('en-US', { weekday: 'short' });
        const forecastTemp = daily.main.temp.toFixed(0);
        const forecastDescription = daily.weather[0].description;
        const forecastIconCode = daily.weather[0].icon;
        const forecastIconUrl = `https://openweathermap.org/img/wn/${forecastIconCode}.png`;

        return `
            <div class="forecast-card">
                <h4>${dayOfWeek}</h4>
                <p>${forecastTemp}°F</p>
                <p>${capitalizeFirstLetter(forecastDescription)} <img src="${forecastIconUrl}" alt="" class="weather-icon" width="50" height="50"></p>
            </div>
        `;
    }).join('');

    weatherDisplay.innerHTML = `
        <div class="current-weather">
            <p>Current Temperature: <strong>${currentTemp}°F</strong></p>
            <p>Condition: ${capitalizeFirstLetter(weatherDescription)} <img src="${weatherIconUrl}" alt="" class="weather-icon" width="50" height="50"></p>
        </div>
        <h3>3-Day Forecast:</h3>
        <div class="forecast-cards">
            ${forecastCardsHtml}
        </div>
    `;
}

function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener("DOMContentLoaded", getWeatherData);