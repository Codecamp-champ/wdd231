const WEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
const LATITUDE = 49.5044;
const LONGITUDE = -115.7725;

async function getWeatherData() {
    const weatherDisplay = document.getElementById("weather-display");
    if (!weatherDisplay) return;

    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${LATITUDE}&lon=${LONGITUDE}&exclude=minutely,hourly&appid=${WEATHER_API_KEY}&units=imperial`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayWeatherData(data);

    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherDisplay.innerHTML = "<p>Could not load weather data. Please check your API key and network connection.</p>";
    }
}

function displayWeatherData(data) {
    const weatherDisplay = document.getElementById("weather-display");
    if (!weatherDisplay) return;

    const currentTemp = data.current.temp.toFixed(0);
    const weatherDescription = data.current.weather[0].description;
    const weatherIconCode = data.current.weather[0].icon;
    const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}.png`;

    let htmlContent = `
        <div class="current-weather">
            <p>Current Temperature: <strong>${currentTemp}°F</strong></p>
            <p>Condition: ${capitalizeFirstLetter(weatherDescription)} <img src="${weatherIconUrl}" alt="${weatherDescription}" class="weather-icon"></p>
        </div>
        <h3>3-Day Forecast:</h3>
        <div class="forecast-cards">
    `;

    for (let i = 1; i <= 3; i++) {
        const daily = data.daily[i];
        const forecastDate = new Date(daily.dt * 1000);
        const dayOfWeek = forecastDate.toLocaleDateString('en-US', { weekday: 'short' });
        const forecastTemp = daily.temp.day.toFixed(0);
        const forecastDescription = daily.weather[0].description;
        const forecastIconCode = daily.weather[0].icon;
        const forecastIconUrl = `https://openweathermap.org/img/wn/${forecastIconCode}.png`;

        htmlContent += `
            <div class="forecast-card">
                <h4>${dayOfWeek}</h4>
                <p>${forecastTemp}°F</p>
                <p>${capitalizeFirstLetter(forecastDescription)} <img src="${forecastIconUrl}" alt="${forecastDescription}" class="weather-icon"></p>
            </div>
        `;
    }

    htmlContent += `</div>`;
    weatherDisplay.innerHTML = htmlContent;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener("DOMContentLoaded", getWeatherData);