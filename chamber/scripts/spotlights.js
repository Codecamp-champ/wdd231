async function loadSpotlights() {
    const spotlightsDisplay = document.getElementById("spotlights-display");
    if (!spotlightsDisplay) return;

    try {
        const response = await fetch("data/members.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const members = data.companies;

        const eligibleMembers = members.filter(member =>
            member.membershipLevel === 3 || member.membershipLevel === 2
        );

        for (let i = eligibleMembers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [eligibleMembers[i], eligibleMembers[j]] = [eligibleMembers[j], eligibleMembers[i]];
        }

        const numberOfSpotlights = Math.floor(Math.random() * 2) + 2;
        const selectedSpotlights = eligibleMembers.slice(0, Math.min(numberOfSpotlights, eligibleMembers.length));

        if (selectedSpotlights.length === 0) {
            spotlightsDisplay.innerHTML = "<p>No Gold or Silver members to display in spotlights at this time.</p>";
            return;
        }

        let htmlContent = '<div class="spotlight-cards">';
        selectedSpotlights.forEach(member => {
            let membershipLevelString = '';
            if (member.membershipLevel === 3) {
                membershipLevelString = 'Gold';
            } else if (member.membershipLevel === 2) {
                membershipLevelString = 'Silver';
            }

            htmlContent += `
                <div class="spotlight-card">
                    <h3>${member.name}</h3>
                    <img src="${member.image}" alt="${member.name} Logo" loading="lazy" class="spotlight-logo">
                    <p><strong>Address:</strong> ${member.address}</p>
                    <p><strong>Phone:</strong> ${member.phone}</p>
                    <p><strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website.replace(/(^\w+:|^)\/\//, '')}</a></p>
                    <p><strong>Membership Level:</strong> <span class="member-level">${membershipLevelString}</span></p>
                    ${member.otherInfo ? `<p class="description">${member.otherInfo}</p>` : ''}
                </div>
            `;
        });
        htmlContent += '</div>';
        spotlightsDisplay.innerHTML = htmlContent;

    } catch (error) {
        console.error("Error loading member spotlights:", error);
        spotlightsDisplay.innerHTML = "<p>Could not load member spotlights.</p>";
    }
}

document.addEventListener("DOMContentLoaded", loadSpotlights);