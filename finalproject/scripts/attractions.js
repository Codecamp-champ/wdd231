import { setupNavToggle } from './nav.js';
import { setupFooter } from './footer.js';

const attractionsDataSource = 'data/attractions.json';
const attractionsContainer = document.getElementById('attractions-container');
const attractionModal = document.getElementById('attraction-modal');
const closeModalButton = document.querySelector('.modal .close-button');
const favoriteButton = document.getElementById('favorite-button');

let currentAttraction = null;
let attractionsData = []; // Store fetched data here

document.addEventListener('DOMContentLoaded', async () => {
    setupNavToggle();
    setupFooter();
    await fetchAndDisplayAttractions();
    setupModalEvents();
});

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
        return [];
    }
}

async function fetchAndDisplayAttractions() {
    attractionsData = await fetchAttractions();
    if (attractionsData.length > 0) {
        displayAttractions(attractionsData);
    }
}

function displayAttractions(attractions) {
    if (!attractionsContainer) return;
    attractionsContainer.innerHTML = '';

    const favoritedAttractions = getFavoritedAttractions();

    attractions.forEach(attraction => {
        const isFavorited = favoritedAttractions.includes(attraction.id);
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
                    <button class="favorite-button ${isFavorited ? 'favorited' : ''}" data-id="${attraction.id}">
                        ${isFavorited ? 'Favorited' : 'Add to Favorites'}
                    </button>
                </div>
            </div>
        `;
        attractionsContainer.insertAdjacentHTML('beforeend', cardHtml);
    });

    setupCardButtonListeners();
    setupLazyLoading();
}

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

function openModalWithAttraction(attractionId) {
    currentAttraction = attractionsData.find(attr => attr.id === attractionId);

    if (currentAttraction && attractionModal) {
        document.getElementById('modal-title').textContent = currentAttraction.name;
        document.getElementById('modal-image').src = `images/${currentAttraction.image}`;
        document.getElementById('modal-image').alt = currentAttraction.name;
        document.getElementById('modal-location').innerHTML = `<strong>Location:</strong> ${currentAttraction.location}`;
        document.getElementById('modal-type').innerHTML = `<strong>Type:</strong> ${currentAttraction.type}`;
        document.getElementById('modal-rating').innerHTML = `<strong>Rating:</strong> ${currentAttraction.rating} / 5`;
        document.getElementById('modal-description').textContent = currentAttraction.description;
        document.getElementById('modal-details').textContent = currentAttraction.details;

        const isFavorited = getFavoritedAttractions().includes(currentAttraction.id);
        favoriteButton.classList.toggle('favorited', isFavorited);
        favoriteButton.textContent = isFavorited ? 'Favorited' : 'Add to Favorites';

        attractionModal.classList.add('active');
        attractionModal.focus();
    }
}

function setupModalEvents() {
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }
    if (attractionModal) {
        attractionModal.addEventListener('click', (event) => {
            if (event.target === attractionModal) {
                closeModal();
            }
        });
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
                const cardButton = document.querySelector(`.attraction-card button.favorite-button[data-id="${currentAttraction.id}"]`);
                if (cardButton) {
                    const isFavorited = favoriteButton.classList.contains('favorited');
                    cardButton.classList.toggle('favorited', isFavorited);
                    cardButton.textContent = isFavorited ? 'Favorited' : 'Add to Favorites';
                }
            }
        });
    }
}

function closeModal() {
    if (attractionModal) {
        attractionModal.classList.remove('active');
    }
}

function getFavoritedAttractions() {
    const favorites = localStorage.getItem('favoritedAttractions');
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavoritedAttractions(favorites) {
    localStorage.setItem('favoritedAttractions', JSON.stringify(favorites));
}

function toggleFavorite(id, button) {
    let favorites = getFavoritedAttractions();
    const isFavorited = favorites.includes(id);

    if (isFavorited) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    
    saveFavoritedAttractions(favorites);
    button.classList.toggle('favorited', !isFavorited);
    button.textContent = isFavorited ? 'Add to Favorites' : 'Favorited';
}

function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy-load-img');

    if ('IntersectionObserver' in window) {
        let lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            lazyLoadObserver.observe(img);
        });
    } else {
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
}