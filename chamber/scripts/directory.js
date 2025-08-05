document.addEventListener('DOMContentLoaded', () => {
    const membersUrl = 'data/members.json';
    const memberDisplay = document.getElementById('member-display');
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    let membersData = [];

    async function getMembers() {
        try {
            const response = await fetch(membersUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            membersData = await response.json();
            displayMembers(membersData, 'grid');
        } catch (error) {
            console.error('There was a problem fetching member data:', error);
            memberDisplay.innerHTML = '<p>Sorry, we could not load the business directory at this time.</p>';
        }
    }

    function displayMembers(members, view) {
        memberDisplay.innerHTML = '';
        memberDisplay.className = view;

        members.forEach(member => {
            const card = document.createElement('div');
            card.className = view === 'grid' ? 'member-card' : 'member-list-item';

            // Create and configure the image element with explicit width and height
            const img = document.createElement('img');
            img.src = member.image;
            img.alt = `Logo of ${member.name}`;
            img.setAttribute('width', '100');
            img.setAttribute('height', '100');
            img.setAttribute('loading', 'lazy'); // Still lazy load to optimize performance

            const infoDiv = document.createElement('div');
            infoDiv.className = view === 'grid' ? 'member-info' : 'member-info';

            const name = document.createElement('h2');
            name.textContent = member.name;

            const address = document.createElement('p');
            address.textContent = member.address;

            const phone = document.createElement('p');
            phone.textContent = member.phone;

            const website = document.createElement('a');
            website.href = member.website;
            website.textContent = member.website;
            website.target = '_blank';

            infoDiv.appendChild(name);
            infoDiv.appendChild(address);
            infoDiv.appendChild(phone);
            infoDiv.appendChild(website);

            card.appendChild(img);
            card.appendChild(infoDiv);

            if (view === 'grid') {
                const membershipLevel = document.createElement('p');
                membershipLevel.textContent = `Membership: ${member.membershipLevel}`;
                infoDiv.appendChild(membershipLevel);
            }

            memberDisplay.appendChild(card);
        });
    }

    gridViewBtn.addEventListener('click', () => {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        displayMembers(membersData, 'grid');
    });

    listViewBtn.addEventListener('click', () => {
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        displayMembers(membersData, 'list');
    });

    getMembers();
});