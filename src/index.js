let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
document.querySelector("#date").innerHTML = `${day}, ${hours}:${minutes}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}
let apiKey = "o9a97135tbf50b064163412c3c56f37d";

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.time)}</div>
         <img src="${
           forecastDay.condition.icon_url
         }" alt="Day weather" width="42" height="42" />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temperature.maximum
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temperature.minimum
          )}° </span>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);

  // let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  https: axios.get(apiUrl).then(displayForecast);
}

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-text-input").value;

  searchCity(searchInput);
}
let form = document.querySelector("#search-form");
form.addEventListener("submit", search);

function searchCity(searchInput) {
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${searchInput}&key=${apiKey}&units=metric`;
  // let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

searchCity("Kyiv");

function displayTemperature(response) {
  let city = document.querySelector("#city");
  celsiusTemperature = response.data.temperature.current;

  let temperature = Math.round(response.data.temperature.current);
  city.innerHTML = `${response.data.city}`;
  let temp = document.querySelector("#degrees-temp");
  if (isCelsius) {
    temp.innerHTML = `${temperature}`;
  } else {
    temp.innerHTML = `${Math.round(calculateFarengheit(temperature))}`;
  }
  let humid = document.querySelector("#humidity");
  humid.innerHTML = response.data.temperature.humidity;
  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed);
  let weatherDeskriptionElement = document.querySelector("#weatherDeskription");
  let weatherDeskription = response.data.condition.description;
  weatherDeskriptionElement.innerHTML =
    weatherDeskription.charAt(0).toUpperCase() + weatherDeskription.slice(1);
  let iconElement = document.querySelector("#mainIcon");
  iconElement.setAttribute("src", `${response.data.condition.icon_url}`);
  iconElement.setAttribute("alt", response.data.condition.description);

  getForecast(response.data.coordinates);
}

function handlePosition(response) {
  let latitude = response.coords.latitude;
  let longitude = response.coords.longitude;

  // let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=metric`;

  https: axios.get(apiUrl).then(displayTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handlePosition);
}
let currentLocationbutton = document.querySelector("button");
currentLocationbutton.addEventListener("click", getCurrentLocation);

function activateFarengheit(event) {
  event.preventDefault();
  isCelsius = false;
  celsiumElement.classList.remove("active");
  farghElement.classList.add("active");
  temperatureElement.innerHTML = Math.round(
    calculateFarengheit(celsiusTemperature)
  );
}

function activateCelsius(event) {
  event.preventDefault();
  isCelsius = true;
  celsiumElement.classList.add("active");
  farghElement.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function calculateFarengheit(celsiusTemperature) {
  return (celsiusTemperature * 9) / 5 + 32;
}

let celsiusTemperature = null;
let isCelsius = true;

const temperatureElement = document.querySelector("#degrees-temp");

const farghElement = document.querySelector("#fargh");
farghElement.addEventListener("click", activateFarengheit);

const celsiumElement = document.querySelector("#celcium");
celsiumElement.addEventListener("click", activateCelsius);
