document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    document.getElementById('fname-display').textContent = params.get('fname') || 'N/A';
    document.getElementById('lname-display').textContent = params.get('lname') || 'N/A';
    document.getElementById('email-display').textContent = params.get('email') || 'N/A';
    document.getElementById('phone-display').textContent = params.get('phone') || 'N/A';
    document.getElementById('bizname-display').textContent = params.get('bizname') || 'N/A';
    
    const timestamp = params.get('timestamp');
    if (timestamp) {
        try {
            const date = new Date(timestamp);
            document.getElementById('timestamp-display').textContent = date.toLocaleString();
        } catch (e) {
            document.getElementById('timestamp-display').textContent = timestamp;
        }
    } else {
        document.getElementById('timestamp-display').textContent = 'N/A';
    }
});