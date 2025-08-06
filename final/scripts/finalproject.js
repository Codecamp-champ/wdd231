document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const currentYear = new Date().getFullYear();
    document.getElementById('currentyear').textContent = currentYear;

    // Set last modified date in footer
    const lastModified = document.lastModified;
    document.getElementById('lastModified').textContent = lastModified;

    // Windchill calculation setup
    const temperature = 5;
    const windSpeed = 10;

    // Function to calculate windchill factor
    function calculateWindChill(temp, wind) {
        // Viable Wind Chill Calculation Conditions (Metric):
        // Temperature must be <= 10 °C (50°F)
        // Wind speed must be > 4.8 km/h (3 mph)
        if (temp <= 10 && wind > 4.8) {
            // Metric Wind Chill Formula (Environment Canada / J.E. Osczevski formula)
            // Twc = 13.12 + 0.6215Ta - 11.37V^0.16 + 0.3965TaV^0.16
            // Ta = air temperature in degrees Celsius
            // V = wind speed in km/h
            const windChill = 13.12 + (0.6215 * temp) - (11.37 * Math.pow(wind, 0.16)) + (0.3965 * temp * Math.pow(wind, 0.16));
            return windChill.toFixed(1) + ' °C';
        } else {
            return 'N/A';
        }
    }

    // Calculate and display windchill when the page loads
    const windChillResult = calculateWindChill(temperature, windSpeed);
    document.getElementById('windchill-value').textContent = windChillResult;
});