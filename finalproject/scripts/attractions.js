import { setupNavToggle } from './nav.js';
import { setupFooter } from './footer.js';

const attractionsDataSource = 'data/attractions.json';
const attractionsContainer = document.getElementById('attractions-container');
const attractionModal = document.getElementById('attraction-modal');
const closeModalButton = document.querySelector('.modal .close-button');
const favoriteButton = document.getElementById('favorite-button');

let currentAttraction = null; // To keep track of the attraction currently in the modal

document.addEventListener('DOMContentLoaded', () => {
    setupNavToggle();
    setupFooter();
    fetchAndDisplayAttractions();
    setupModalEvents();
});

/**
 * Fetches attraction data from a local JSON file.
 * @returns {Promise<Array>} A promise that resolves to an array of attraction objects.
 */
async function fetchAttractions() {
    try {
        const response = await fetch(attractionsDataSource);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch attractions data:', error);
        if (attractionsContainer) {
            attractionsContainer.innerHTML = '<p class="error-message">Failed to load attractions. Please try again later.</p>';
        }
        return []; // Return empty array on error
    }
}

/**
 * Dynamically creates and appends attraction cards to the DOM.
 * @param {Array} attractions - An array of attraction objects.
 */
function displayAttractions(attractions) {
    if (!attractionsContainer) return;

    attractionsContainer.innerHTML = ''; // Clear existing content

    // Retrieve favorited attractions from local storage
    const favoritedAttractions = getFavoritedAttractions();

    // Use forEach to iterate over the attractions array
    attractions.forEach(attraction => {
        // Use template literals to construct the HTML for each card
        const cardHtml = `
            <div class="attraction-card" data-id="${attraction.id}">
                <img data-src="images/${attraction.image}" alt="${attraction.name}" class="lazy-load-img">
                <h3>${attraction.name}</h3>
                <p><strong>Location:</strong> ${attraction.location}</p>
                <p><strong>Type:</strong> ${attraction.type}</p>
                <p><strong>Rating:</strong> ${attraction.rating} / 5</p>
                <p>${attraction.description}</p>
                <div class="card-buttons">
                    <button class="learn-more-button" data-id="${attraction.id}">Learn More</button>
                    <button class="favorite-button ${favoritedAttractions.includes(attraction.id) ? 'favorited' : ''}" data-id="${attraction.id}">
                        ${favoritedAttractions.includes(attraction.id) ? 'Favorited' : 'Add to Favorites'}
                    </button>
                </div>
            </div>
        `;
        attractionsContainer.insertAdjacentHTML('beforeend', cardHtml);
    });

    // Setup event listeners for the newly created buttons
    setupCardButtonListeners();
    // Initialize lazy loading for images
    setupLazyLoading();
}

/**
 * Sets up event listeners for 'Learn More' and 'Favorite' buttons on attraction cards.
 */
function setupCardButtonListeners() {
    document.querySelectorAll('.learn-more-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const attractionId = event.target.dataset.id;
            openModalWithAttraction(attractionId);
        });
    });

    document.querySelectorAll('.attraction-card .favorite-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const attractionId = event.target.dataset.id;
            toggleFavorite(attractionId, button);
        });
    });
}

/**
 * Opens the modal dialog with details of the selected attraction.
 * @param {string} attractionId - The ID of the attraction to display.
 */
async function openModalWithAttraction(attractionId) {
    const attractions = await fetchAttractions(); // Re-fetch or pass data
    currentAttraction = attractions.find(attr => attr.id === attractionId);

    if (currentAttraction && attractionModal) {
        document.getElementById('modal-title').textContent = currentAttraction.name;
        document.getElementById('modal-image').src = `images/${currentAttraction.image}`;
        document.getElementById('modal-image').alt = currentAttraction.name;
        document.getElementById('modal-location').innerHTML = `<strong>Location:</strong> ${currentAttraction.location}`;
        document.getElementById('modal-type').innerHTML = `<strong>Type:</strong> ${currentAttraction.type}`;
        document.getElementById('modal-rating').innerHTML = `<strong>Rating:</strong> ${currentAttraction.rating} / 5`;
        document.getElementById('modal-description').textContent = currentAttraction.description;
        document.getElementById('modal-details').textContent = currentAttraction.details;

        // Update favorite button state in modal
        const favoritedAttractions = getFavoritedAttractions();
        if (favoritedAttractions.includes(currentAttraction.id)) {
            favoriteButton.classList.add('favorited');
            favoriteButton.textContent = 'Favorited';
        } else {
            favoriteButton.classList.remove('favorited');
            favoriteButton.textContent = 'Add to Favorites';
        }

        attractionModal.classList.add('active'); // Show modal
        attractionModal.focus(); // Set focus for accessibility
    }
}

/**
 * Sets up event listeners for the modal dialog.
 */
function setupModalEvents() {
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }
    if (attractionModal) {
        attractionModal.addEventListener('click', (event) => {
            // Close modal if clicked outside modal-content
            if (event.target === attractionModal) {
                closeModal();
            }
        });
        // Close modal with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && attractionModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    if (favoriteButton) {
        favoriteButton.addEventListener('click', () => {
            if (currentAttraction) {
                toggleFavorite(currentAttraction.id, favoriteButton);
                // Also update the button on the card if it exists
                const cardButton = document.querySelector(`.attraction-card button.favorite-button[data-id="${currentAttraction.id}"]`);
                if (cardButton) {
                    if (favoriteButton.classList.contains('favorited')) {
                        cardButton.classList.add('favorited');
                        cardButton.textContent = 'Favorited';
                    } else {
                        cardButton.classList.remove('favorited');
                        cardButton.textContent = 'Add to Favorites';
                    }
                }
            }
        });
    }
}

/**
 * Closes the modal dialog.
 */
function closeModal() {
    if (attractionModal) {
        attractionModal.classList.remove('active');
    }
}

/**
 * Retrieves favorited attraction IDs from local storage.
 * @returns {Array<string>} An array of favorited attraction IDs.
 */
function getFavoritedAttractions() {
    const favorites = localStorage.getItem('favoritedAttractions');
    return favorites ? JSON.parse(favorites) : [];
}

/**
 * Saves favorited attraction IDs to local storage.
 * @param {Array<string>} favorites - An array of favorited attraction IDs.
 */
function saveFavoritedAttractions(favorites) {
    localStorage.setItem('favoritedAttractions', JSON.stringify(favorites));
}

/**
 * Toggles an attraction's favorite status in local storage and updates the button text.
 * @param {string} id - The ID of the attraction.
 * @param {HTMLElement} button - The button element to update.
 */
function toggleFavorite(id, button) {
    let favorites = getFavoritedAttractions();
    if (favorites.includes(id)) {
        // Remove from favorites using filter array method
        favorites = favorites.filter(favId => favId !== id);
        button.classList.remove('favorited');
        button.textContent = 'Add to Favorites';
    } else {
        // Add to favorites
        favorites.push(id);
        button.classList.add('favorited');
        button.textContent = 'Favorited';
    }
    saveFavoritedAttractions(favorites);
}

/**
 * Initializes lazy loading for images with the 'lazy-load-img' class.
 */
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy-load-img');

    if ('IntersectionObserver' in window) {
        let lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded'); // Add a class for fade-in effect
                    observer.unobserve(img); // Stop observing once loaded
                }
            });
        });

        lazyImages.forEach(img => {
            lazyLoadObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
}

/**
 * Main function to fetch and display attractions.
 */
async function fetchAndDisplayAttractions() {
    const attractions = await fetchAttractions();
    if (attractions.length > 0) {
        displayAttractions(attractions);
    }
}