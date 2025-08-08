export function updateFooter() {
    const lastModified = document.getElementById('lastModified');
    const currentYear = document.getElementById('currentyear');
    
    if (lastModified) {
        lastModified.textContent = document.lastModified;
    }
    
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}