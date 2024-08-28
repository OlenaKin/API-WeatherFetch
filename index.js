'use strict';

const API_KEY = 'd6d046a314008a4c574578b20d3a7a81'; // Your API key
const LAT = 51.5074; // Latitude for London
const LON = -0.1278; // Longitude for London
const API_URL = `https://api.openweathermap.org/data/3.0/onecall?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`;

console.log('API URL:', API_URL); 

function getWeather() {
    const lastFetch = localStorage.getItem('lastWeatherFetch');
    const currentTime = new Date().getTime();

    console.log('Current time:', currentTime);
    console.log('Last fetch time:', lastFetch);

    if (lastFetch && currentTime - lastFetch < 2 * 60 * 60 * 1000) {
        // If less than 2 hours have passed since the last fetch, use localStorage data
        const weatherData = localStorage.getItem('weatherData');
        if (weatherData) {
            console.log('Using cached weather data.');
            displayWeather(JSON.parse(weatherData));
        } else {
            console.error('No weather data found in localStorage.');
            displayError('No weather data found in localStorage.');
        }
    } else {
        // Otherwise, fetch new data from the API
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok. Status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('API Response:', data); // Log API response for debugging
                if (data && data.current) {
                    // Save the new data in localStorage
                    localStorage.setItem('weatherData', JSON.stringify(data));
                    localStorage.setItem('lastWeatherFetch', currentTime);
                    displayWeather(data);
                } else {
                    console.error('Unexpected API response structure:', data);
                    displayError('Unexpected API response structure.');
                }
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                displayError('Unable to fetch weather data. Please check your internet connection.');
            });
    }
}

function displayWeather(data) {
    const weatherContainer = document.getElementById('weather'); 
    if (weatherContainer) {
        if (data && data.current) {
            const temperature = data.current.temp;
            const description = data.current.weather[0].description;
            const city = 'London'; // API does not return the city name, so use a static value

            weatherContainer.innerHTML = `
                <h2>Weather in ${city}</h2>
                <p>Temperature: ${temperature}°C</p>
                <p>Description: ${description}</p>
            `;
        } else {
            displayError('Weather data is unavailable.');
        }
    } else {
        console.error('Weather container element not found.');
    }
}

function displayError(message) {
    const weatherContainer = document.getElementById('weather');
    if (weatherContainer) {
        weatherContainer.innerHTML = `<p>${message}</p>`;
    } else {
        console.error('Weather container element not found.');
    }
}

// Call the function to get the weather when the page loads
getWeather();
