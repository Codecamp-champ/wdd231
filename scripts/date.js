document.addEventListener('DOMContentLoaded', () => {
    // Dynamically set current year in footer
    const currentYearSpan = document.getElementById('currentyear'); // Changed ID to 'currentyear'
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Dynamically set last modified date in footer
    const lastModifiedParagraph = document.getElementById('lastModified');
    if (lastModifiedParagraph) {
        // document.lastModified returns a string like "MM/DD/YYYY HH:MM:SS"
        lastModifiedParagraph.textContent = document.lastModified; // Display directly as required
    }
});