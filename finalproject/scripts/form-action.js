import { setupNavToggle } from './nav.js';
import { setupFooter } from './footer.js';

document.addEventListener('DOMContentLoaded', () => {
    setupNavToggle();
    setupFooter();
    displayFormData();
});

/**
 * Parses URL parameters and displays them on the form action page.
 */
function displayFormData() {
    const submissionDetails = document.getElementById('submission-details');
    if (!submissionDetails) return;

    const urlParams = new URLSearchParams(window.location.search);
    let htmlContent = '';

    // Check if there are any parameters
    if (Array.from(urlParams.entries()).length === 0) {
        htmlContent = '<p>No form data submitted.</p>';
    } else {
        // Iterate over each parameter and display it
        // Using forEach array method to process parameters
        urlParams.forEach((value, key) => {
            // Format the key for better readability
            const readableKey = key.replace(/([A-Z])/g, ' $1')
                                 .replace(/^./, str => str.toUpperCase())
                                 .replace('Fullname', 'Full Name')
                                 .replace('Email', 'Email')
                                 .replace('Phone', 'Phone')
                                 .replace('Country', 'Country')
                                 .replace('Subject', 'Subject')
                                 .replace('Message', 'Message');
            
            // Use template literals for string construction
            htmlContent += `<p><strong>${readableKey}:</strong> ${decodeURIComponent(value)}</p>`;
        });
    }
    submissionDetails.innerHTML = htmlContent;
}