document.addEventListener('DOMContentLoaded', async function() {
    const memberDisplay = document.getElementById('member-display');
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');

    const membersDataPath = 'data/members.json'; // Path to your JSON file

    // Function to fetch members data
    async function getMembersData() {
        try {
            const response = await fetch(membersDataPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.companies; // Assuming your JSON has a 'companies' array
        } catch (error) {
            console.error('Error fetching members data:', error);
            memberDisplay.innerHTML = '<p>Failed to load member data. Please try again later.</p>';
            return []; // Return empty array on error
        }
    }

    // Function to create a member card
    function createMemberCard(member) {
        const card = document.createElement('div');
        card.classList.add('member-card');

        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} Logo">
            <h2>${member.name}</h2>
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <a href="${member.website}" target="_blank">${member.website.replace(/(^\w+:|^)\/\//, '')}</a>
            <p class="membership-level">Membership: ${member.membershipLevel === 1 ? 'Non-Profit' : member.membershipLevel === 2 ? 'Silver' : 'Gold'}</p>
            ${member.otherInfo ? `<p>${member.otherInfo}</p>` : ''}
        `;
        return card;
    }

    // Function to create a member list item
    function createMemberListItem(member) {
        const listItem = document.createElement('div');
        listItem.classList.add('member-list-item');

        listItem.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} Logo">
            <div class="member-info">
                <h2>${member.name}</h2>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <a href="${member.website}" target="_blank">${member.website.replace(/(^\w+:|^)\/\//, '')}</a>
            </div>
            <p class="membership-level-list">Level: ${member.membershipLevel === 1 ? 'Non-Profit' : member.membershipLevel === 2 ? 'Silver' : 'Gold'}</p>
        `;
        return listItem;
    }

    // Function to display members based on current view
    async function displayMembers(viewType) {
        const members = await getMembersData();
        memberDisplay.innerHTML = ''; // Clear current display
        memberDisplay.className = ''; // Clear previous view classes
        memberDisplay.classList.add(viewType);

        members.forEach(member => {
            if (viewType === 'grid') {
                memberDisplay.appendChild(createMemberCard(member));
            } else if (viewType === 'list') {
                memberDisplay.appendChild(createMemberListItem(member));
            }
        });
    }

    // Event Listeners for view toggle buttons
    gridViewBtn.addEventListener('click', () => {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        displayMembers('grid');
    });

    listViewBtn.addEventListener('click', () => {
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        displayMembers('list');
    });

    // Initial load: Display members in grid view by default
    displayMembers('grid');
});