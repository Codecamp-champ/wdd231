document.addEventListener('DOMContentLoaded', () => {
    const spotlightsDisplay = document.getElementById('spotlights-display');
    const apiUrl = 'https://codecamp-champ.github.io/wdd231/chamber/data/members.json';

    async function getSpotlights() {
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                displaySpotlights(data.companies);
            } else {
                throw new Error('Failed to fetch spotlights.');
            }
        } catch (error) {
            console.error('Error fetching spotlights:', error);
            spotlightsDisplay.innerHTML = '<p>Error loading member spotlights. Please try again later.</p>';
        }
    }

    function displaySpotlights(companies) {
        const goldAndSilverMembers = companies.filter(member => member.membershipLevel >= 2);
        
        if (goldAndSilverMembers.length === 0) {
            spotlightsDisplay.innerHTML = '<p>No current member spotlights to display.</p>';
            return;
        }

        const randomSpotlights = [];
        const shuffledMembers = goldAndSilverMembers.sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < Math.min(3, shuffledMembers.length); i++) {
            randomSpotlights.push(shuffledMembers[i]);
        }

        const spotlightsContainer = document.createElement('div');
        spotlightsContainer.className = 'spotlight-cards';
        
        randomSpotlights.forEach(member => {
            const card = document.createElement('div');
            card.className = 'spotlight-card';
            
            const logo = document.createElement('img');
            logo.src = member.image;
            logo.alt = member.name + ' Logo';
            logo.loading = 'lazy';
            logo.className = 'spotlight-logo';
            
            const name = document.createElement('h3');
            name.textContent = member.name;
            
            const info = document.createElement('p');
            info.textContent = member.otherInfo;
            
            const website = document.createElement('a');
            website.href = member.website;
            website.textContent = 'Learn More';
            website.target = '_blank';
            
            card.appendChild(logo);
            card.appendChild(name);
            card.appendChild(info);
            card.appendChild(website);
            spotlightsContainer.appendChild(card);
        });

        spotlightsDisplay.innerHTML = '';
        spotlightsDisplay.appendChild(spotlightsContainer);
    }

    getSpotlights();
});