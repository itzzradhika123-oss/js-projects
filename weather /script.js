let cityInput = document.getElementById("cityInput");
let weatherButton = document.getElementById("weatherButton");

weatherButton.addEventListener("click", getWeather);

async function getWeather() {

    let city = cityInput.value;

    if (city == "") {
        document.getElementById("error").textContent =
            "Please enter a city name.";
        return;
    }

    document.getElementById("error").textContent = "";

    try {

        // Find the latitude and longitude of the city
        let locationResponse = await fetch(
            "https://geocoding-api.open-meteo.com/v1/search?name=" +
            city +
            "&count=1&language=en&format=json"
        );

        let locationData = await locationResponse.json();

        if (!locationData.results) {
            document.getElementById("error").textContent =
                "City not found.";
            return;
        }

        let latitude = locationData.results[0].latitude;
        let longitude = locationData.results[0].longitude;
        let cityName = locationData.results[0].name;

        // Get weather using latitude and longitude
        let weatherResponse = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=" +
            latitude +
            "&longitude=" +
            longitude +
            "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m"
        );

        let weatherData = await weatherResponse.json();

        let temperature =
            weatherData.current.temperature_2m;

        let humidity =
            weatherData.current.relative_humidity_2m;

        let windSpeed =
            weatherData.current.wind_speed_10m;

        let weatherCode =
            weatherData.current.weather_code;

        // Display the information
        document.getElementById("cityName").textContent =
            cityName;

        document.getElementById("temperature").textContent =
            temperature + " °C";

        document.getElementById("humidity").textContent =
            "Humidity: " + humidity + "%";

        document.getElementById("wind").textContent =
            "Wind Speed: " + windSpeed + " km/h";

        // Display weather condition and emoji
        showWeather(weatherCode);

    }
    catch (error) {

        document.getElementById("error").textContent =
            "Something went wrong. Please try again.";

    }
}


function showWeather(code) {

    let condition = document.getElementById("condition");
    let emoji = document.getElementById("weatherEmoji");

    if (code == 0) {
        condition.textContent = "Clear Sky";
        emoji.textContent = "☀️";
    }

    else if (code >= 1 && code <= 3) {
        condition.textContent = "Partly Cloudy";
        emoji.textContent = "🌤️";
    }

    else if (code >= 45 && code <= 48) {
        condition.textContent = "Foggy";
        emoji.textContent = "🌫️";
    }

    else if (code >= 51 && code <= 67) {
        condition.textContent = "Rainy";
        emoji.textContent = "🌧️";
    }

    else if (code >= 71 && code <= 77) {
        condition.textContent = "Snowy";
        emoji.textContent = "❄️";
    }

    else if (code >= 80 && code <= 82) {
        condition.textContent = "Rain Showers";
        emoji.textContent = "🌦️";
    }

    else if (code >= 95) {
        condition.textContent = "Thunderstorm";
        emoji.textContent = "⛈️";
    }

    else {
        condition.textContent = "Unknown Weather";
        emoji.textContent = "🌍";
    }
}