const WEATHER_API_KEY = '2d7a0b25d9910e4763e5868f0c50f3d2';
const LATITUDE = 63.98;
const LONGITUDE = -22.63;

// DOM Elements
const menuButton = document.getElementById('menu-button');
const mainNav = document.getElementById('main-nav');
const currentYearSpan = document.getElementById('currentyear');
const lastModifiedSpan = document.getElementById('lastmodified');
const attractionsContainer = document.getElementById('attractions-container');
const attractionModal = document.getElementById('attraction-modal');
const closeModalButton = document.getElementById('close-modal-button');
const formDataDisplay = document.getElementById('form-data-display');
const contactForm = document.getElementById('contact-form');

// Global functionality
document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle
    if (menuButton && mainNav) {
        menuButton.addEventListener('click', () => {
            mainNav.classList.toggle('show');
        });
    }

    // Footer dates
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }

    // Dynamic content generation for attractions page
    if (attractionsContainer) {
        loadAttractionsData();
    }

    // Handle form data display on thank-you page
    if (formDataDisplay) {
        displayFormData();
    }

    // Load weather data on the home page
    if (document.body.classList.contains('index-page')) {
        getWeatherData();
    }
});


/**
 * Fetches attractions data from a local JSON file and displays it.
 */
async function loadAttractionsData() {
    try {
        const response = await fetch('data/attractions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Use an array method to process the data
        data.attractions.forEach(attraction => {
            createAttractionCard(attraction);
        });

        // Add event listeners for the modal
        const cards = document.querySelectorAll('.attraction-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const attractionId = card.dataset.id;
                const selectedAttraction = data.attractions.find(item => item.id == attractionId);
                if (selectedAttraction) {
                    showModal(selectedAttraction);
                }
            });
        });

        if (closeModalButton) {
            closeModalButton.addEventListener('click', () => {
                attractionModal.close();
            });
        }
    
    } catch (error) {
        console.error('Error fetching or processing attractions data:', error);
        if (attractionsContainer) {
            attractionsContainer.innerHTML = '<p>Error loading attractions. Please try again later.</p>';
        }
    }
}

/**
 * Creates and appends an attraction card to the DOM.
 * @param {object} attractionData - The data for a single attraction.
 */
function createAttractionCard(attractionData) {
    const card = document.createElement('div');
    card.classList.add('attraction-card');
    card.dataset.id = attractionData.id;

    // Use a template literal for dynamic content generation
    card.innerHTML = `
        <img src="${attractionData.imageUrl}" alt="${attractionData.name}" loading="lazy">
        <div class="attraction-card-content">
            <h3>${attractionData.name}</h3>
            <p>${attractionData.shortDescription}</p>
        </div>
    `;
    attractionsContainer.appendChild(card);
}

/**
 * Populates and displays the modal dialog with attraction details.
 * @param {object} data - The data for the selected attraction.
 */
function showModal(data) {
    if (attractionModal) {
        document.getElementById('modal-title').textContent = data.name;
        document.getElementById('modal-image').src = data.imageUrl;
        document.getElementById('modal-image').alt = data.name;
        document.getElementById('modal-description').textContent = data.description;
        document.getElementById('modal-region').textContent = data.region;
        document.getElementById('modal-type').textContent = data.type;
        attractionModal.showModal();
    }
}

/**
 * Displays form data from the URL on the thank-you page.
 */
function displayFormData() {
    const urlParams = new URLSearchParams(window.location.search);
    let htmlContent = '<h3>Your Submission Details:</h3>';
    
    // Check for local storage data
    const lastSubmission = JSON.parse(localStorage.getItem('lastFormSubmission'));
    if (lastSubmission) {
        htmlContent += `
            <p><strong>Name:</strong> ${lastSubmission.fullname}</p>
            <p><strong>Email:</strong> ${lastSubmission.email}</p>
            <p><strong>Topic:</strong> ${lastSubmission.topic}</p>
            <p><strong>Message:</strong> ${lastSubmission.message}</p>
        `;
    } else {
        htmlContent += '<p>No recent form submission found.</p>';
    }
    
    if (formDataDisplay) {
        formDataDisplay.innerHTML = htmlContent;
    }
}

// Store form data in local storage before submission
if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        const formData = new FormData(event.target);
        const submission = {
            fullname: formData.get('fullname'),
            email: formData.get('email'),
            topic: formData.get('topic'),
            message: formData.get('message')
        };
        localStorage.setItem('lastFormSubmission', JSON.stringify(submission));
    });
}

// Weather API functions
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