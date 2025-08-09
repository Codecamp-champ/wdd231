import { fetchWeatherData, calculateWindChill } from './modules/weather.js';

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
        fetchWeatherData();
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

        closeModalButton.addEventListener('click', () => {
            attractionModal.close();
        });
    
    } catch (error) {
        console.error('Error fetching or processing attractions data:', error);
        attractionsContainer.innerHTML = '<p>Error loading attractions. Please try again later.</p>';
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
            <h4>${attractionData.name}</h4>
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
    document.getElementById('modal-title').textContent = data.name;
    document.getElementById('modal-image').src = data.imageUrl;
    document.getElementById('modal-image').alt = data.name;
    document.getElementById('modal-description').textContent = data.description;
    document.getElementById('modal-region').textContent = data.region;
    document.getElementById('modal-type').textContent = data.type;
    attractionModal.showModal();
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
    
    formDataDisplay.innerHTML = htmlContent;
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