document.addEventListener('DOMContentLoaded', () => {
    const viewToggle = document.querySelector('.view-toggle');
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const memberDisplay = document.getElementById('member-display');

    const apiUrl = 'https://codecamp-champ.github.io/wdd231/chamber/data/members.json';

    async function getMembers() {
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                displayMembers(data.companies, 'grid');
            } else {
                throw new Error('Failed to fetch member data.');
            }
        } catch (error) {
            console.error('Error fetching members:', error);
            memberDisplay.innerHTML = '<p>Error loading business directory. Please try again later.</p>';
        }
    }

    function displayMembers(members, view) {
        memberDisplay.innerHTML = '';
        memberDisplay.className = view;

        members.forEach(member => {
            if (view === 'grid') {
                const card = document.createElement('div');
                card.className = 'member-card';

                const logo = document.createElement('img');
                logo.src = member.image;
                logo.alt = member.name + ' Logo';
                logo.loading = 'lazy';
                card.appendChild(logo);

                const name = document.createElement('h2');
                name.textContent = member.name;
                card.appendChild(name);

                const address = document.createElement('p');
                address.textContent = member.address;
                card.appendChild(address);

                const phone = document.createElement('p');
                phone.textContent = member.phone;
                card.appendChild(phone);

                const website = document.createElement('a');
                website.href = member.website;
                website.textContent = 'Visit Website';
                website.target = '_blank';
                card.appendChild(website);

                memberDisplay.appendChild(card);
            } else if (view === 'list') {
                const listItem = document.createElement('div');
                listItem.className = 'member-list-item';

                const logo = document.createElement('img');
                logo.src = member.image;
                logo.alt = member.name + ' Logo';
                logo.loading = 'lazy';
                listItem.appendChild(logo);

                const info = document.createElement('div');
                info.className = 'member-info';

                const name = document.createElement('h2');
                name.textContent = member.name;
                info.appendChild(name);

                const address = document.createElement('p');
                address.textContent = member.address;
                info.appendChild(address);

                const phone = document.createElement('p');
                phone.textContent = member.phone;
                info.appendChild(phone);

                const website = document.createElement('a');
                website.href = member.website;
                website.textContent = 'Visit Website';
                website.target = '_blank';
                info.appendChild(website);

                listItem.appendChild(info);
                memberDisplay.appendChild(listItem);
            }
        });
    }

    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', () => {
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            getMembers().then(data => displayMembers(data.companies, 'grid'));
        });
    }

    if (listViewBtn) {
        listViewBtn.addEventListener('click', () => {
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            getMembers().then(data => displayMembers(data.companies, 'list'));
        });
    }

    getMembers();
});