document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById('fname-display').textContent = urlParams.get('fname');
    document.getElementById('lname-display').textContent = urlParams.get('lname');
    document.getElementById('email-display').textContent = urlParams.get('email');
    document.getElementById('phone-display').textContent = urlParams.get('phone');
    document.getElementById('bizname-display').textContent = urlParams.get('bizname');
    document.getElementById('timestamp-display').textContent = urlParams.get('timestamp');
});