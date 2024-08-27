// script.js

const apiKey = '955640e1ed81cb8bf7b737a31ba95f57'; // Replace with your OpenWeatherMap API key

// Select DOM elements
const locationInput = document.getElementById('location-input');
const searchButton = document.getElementById('search-button');
const weatherContainer = document.getElementById('weather-container');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weather-icon');
const forecastContainer = document.getElementById('forecast-container');
const additionalInfoContainer = document.getElementById('additional-info');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const aqiElement = document.getElementById('aqi');
const aqiStatusElement = document.getElementById('aqi-status');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Icon mapping for weather conditions
const iconMapping = {
    'Clear': 'sunny.png',           // Place sunny icon in images/sunny.png
    'Clouds': 'cloudy.png',         // Place cloudy icon in images/cloudy.png
    'Rain': 'rainy.png',            // Place rainy icon in images/rainy.png
    'Snow': 'snowy.png',            // Place snowy icon in images/snowy.png
    'Thunderstorm': 'thunderstorm.png', // Place thunderstorm icon in images/thunderstorm.png
    'Drizzle': 'drizzle.png'        // Place drizzle icon in images/drizzle.png
};

// Forecast icons
const forecastIcons = [
    'forecast-day1.png', // Replace with actual icon for day 1 forecast
    'forecast-day2.png', // Replace with actual icon for day 2 forecast
    'forecast-day3.png'  // Replace with actual icon for day 3 forecast
];

// Event listeners
searchButton.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        fetchWeatherData(location);
    } else {
        alert('Please enter a location.');
    }
});

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Fetch weather data from OpenWeatherMap
function fetchWeatherData(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    // Hide sections while loading
    weatherContainer.classList.add('hidden');
    forecastContainer.classList.add('hidden');
    additionalInfoContainer.classList.add('hidden');

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeatherData(data);
                fetchForecastData(data.coord.lat, data.coord.lon);
            } else {
                alert('Location not found.');
            }
        })
        .catch(() => {
            alert('Error fetching weather data.');
        })
        .finally(() => {
            weatherContainer.classList.remove('hidden');
        });
}

// Display weather data
function displayWeatherData(data) {
    cityName.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description;

    // Set weather icon
    const icon = iconMapping[data.weather[0].main] || 'default.png';
    weatherIcon.src = `images/${icon}`;

    // Change background image based on weather condition
    document.body.style.backgroundImage = `url('images/${getBackgroundImage(data.weather[0].main)}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';

    // Display additional info
    humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeedElement.textContent = `Wind Speed: ${data.wind.speed} m/s`;

    fetchAirQualityData(data.coord.lat, data.coord.lon);
}

// Fetch air quality data
function fetchAirQualityData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const aqi = data.list[0].main.aqi;
            aqiElement.textContent = `AQI: ${aqi}`;
            aqiStatusElement.textContent = getAqiStatus(aqi);
            additionalInfoContainer.classList.remove('hidden');
        })
        .catch(() => {
            aqiElement.textContent = 'AQI data not available.';
            aqiStatusElement.textContent = '';
        });
}

// Fetch forecast data for the next 3 days
function fetchForecastData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const forecasts = data.list.filter((_, index) => index % 8 === 0).slice(1, 4); // Get the 3 daily forecasts

            forecasts.forEach((forecast, index) => {
                document.getElementById(`icon-${index + 1}`).src = `images/${forecastIcons[index]}`;
                document.getElementById(`temp-${index + 1}`).textContent = `${Math.round(forecast.main.temp)}°C`;
            });

            forecastContainer.classList.remove('hidden');
        })
        .catch(() => {
            forecastContainer.classList.add('hidden');
        });
}

// Get background image based on weather condition
function getBackgroundImage(condition) {
    switch (condition) {
        case 'Clear':
            return 'sunny-bg.jpg'; // Replace with your sunny background image
        case 'Clouds':
            return 'cloudy-bg.jpg'; // Replace with your cloudy background image
        case 'Rain':
            return 'rainy-bg.jpg'; // Replace with your rainy background image
        case 'Snow':
            return 'snowy-bg.jpg'; // Replace with your snowy background image
        case 'Thunderstorm':
            return 'thunderstorm-bg.jpg'; // Replace with your thunderstorm background image
        case 'Drizzle':
            return 'drizzle-bg.jpg'; // Replace with your drizzle background image
        default:
            return 'default-bg.jpg'; // Replace with your default background image
    }
}

// Get AQI status based on AQI value
function getAqiStatus(aqi) {
    if (aqi === 1) return 'Good';
    if (aqi === 2) return 'Fair';
    if (aqi === 3) return 'Moderate';
    if (aqi === 4) return 'Poor';
    if (aqi === 5) return 'Very Poor';
    return 'Unknown';
}