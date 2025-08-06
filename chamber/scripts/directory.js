document.addEventListener('DOMContentLoaded', () => {
    // The correct path assumes the directory.js file is in a 'scripts' folder,
    // and the 'data' folder is one level up, in the same directory as 'directory.html'.
    const membersUrl = '../data/members.json'; 
    const memberDisplay = document.getElementById('member-display');
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    let membersData = [];

    // Fetches the member data from the JSON file
    async function getMembers() {
        try {
            const response = await fetch(membersUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            membersData = await response.json();
            // Initially display in grid view
            displayMembers(membersData.companies, 'grid');
        } catch (error) {
            console.error('There was a problem fetching member data:', error);
            // Display an error message if the fetch fails
            memberDisplay.innerHTML = '<p>Sorry, we could not load the business directory at this time.</p>';
        }
    }

    // Displays the member data in either grid or list view
    function displayMembers(members, view) {
        memberDisplay.innerHTML = ''; // Clear the display before rendering
        memberDisplay.className = view; // Set the class for CSS styling

        members.forEach(member => {
            const card = document.createElement('div');
            // Use different class for list view styling
            card.className = view === 'grid' ? 'member-card' : 'member-list-item';

            const img = document.createElement('img');
            img.src = member.image;
            img.alt = `Logo of ${member.name}`;
            img.setAttribute('width', '100');
            img.setAttribute('height', '100');
            img.setAttribute('loading', 'lazy');

            const infoDiv = document.createElement('div');
            infoDiv.className = 'member-info';

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

            // Membership level is only shown in grid view
            if (view === 'grid') {
                const membershipLevel = document.createElement('p');
                membershipLevel.textContent = `Membership: ${member.membershipLevel}`;
                infoDiv.appendChild(membershipLevel);
            }

            card.appendChild(img);
            card.appendChild(infoDiv);

            memberDisplay.appendChild(card);
        });
    }

    // Event listener for the grid view button
    gridViewBtn.addEventListener('click', () => {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        displayMembers(membersData.companies, 'grid');
    });

    // Event listener for the list view button
    listViewBtn.addEventListener('click', () => {
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        displayMembers(membersData.companies, 'list');
    });

    // Initial call to fetch and display the data when the page loads
    getMembers();
});