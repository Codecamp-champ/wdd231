document.addEventListener('DOMContentLoaded', () => {
    const discoverGrid = document.getElementById('discover-grid');
    const visitMessageDiv = document.getElementById('visit-message');
    const attractionsUrl = 'data/discover.json';

    function displayVisitMessage() {
        const lastVisit = Number(localStorage.getItem('lastVisit'));
        const now = Date.now();
        const oneDay = 1000 * 60 * 60 * 24;

        if (!lastVisit) {
            visitMessageDiv.textContent = "Welcome! Let us know if you have any questions.";
        } else {
            const daysDifference = Math.floor((now - lastVisit) / oneDay);
            if (daysDifference < 1) {
                visitMessageDiv.textContent = "Back so soon! Awesome!";
            } else if (daysDifference === 1) {
                visitMessageDiv.textContent = "You last visited 1 day ago.";
            } else {
                visitMessageDiv.textContent = `You last visited ${daysDifference} days ago.`;
            }
        }
        localStorage.setItem('lastVisit', now);
    }

    async function getAttractions() {
        try {
            const response = await fetch(attractionsUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayAttractions(data.attractions);
        } catch (error) {
            console.error('Error fetching attractions data:', error);
            discoverGrid.innerHTML = '<p>Could not load attractions data. Please check file paths.</p>';
        }
    }

    function displayAttractions(attractions) {
        discoverGrid.innerHTML = '';
        attractions.forEach((attraction, index) => {
            const card = document.createElement('div');
            card.className = 'attraction-card';

            const h2 = document.createElement('h2');
            h2.textContent = attraction.name;

            const figure = document.createElement('figure');
            const img = document.createElement('img');
            img.src = attraction.image;
            img.alt = attraction.name;
            img.setAttribute('width', '300');
            img.setAttribute('height', '200');
            
            if (index > 2) {
                img.setAttribute('loading', 'lazy');
            }

            figure.appendChild(img);

            const address = document.createElement('address');
            address.textContent = attraction.address;

            const p = document.createElement('p');
            p.textContent = attraction.description;

            const button = document.createElement('button');
            button.textContent = "Learn More";

            card.appendChild(h2);
            card.appendChild(figure);
            card.appendChild(address);
            card.appendChild(p);
            card.appendChild(button);

            discoverGrid.appendChild(card);
        });
    }

    displayVisitMessage();
    getAttractions();
});