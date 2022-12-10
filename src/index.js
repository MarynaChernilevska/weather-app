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

function displayForecast() {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  let days = ["Thu", "Fri", "Sat", "Sun"];
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
 <div class="col-2">
              <div class="weather-forecast-date">${day}</div>
              <img
                src="http://openweathermap.org/img/wn/50d@2x.png"
                alt=""
                width="42"
              />
              <div class="weather-forecast-temperatures">
                <span class="weather-forecast-temperature-max"> 18° </span>
                <span class="weather-forecast-temperature-min"> 12° </span>
              </div>
            </div>
`;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-text-input").value;

  searchCity(searchInput);
}
let form = document.querySelector("#search-form");
form.addEventListener("submit", search);

function searchCity(searchInput) {
  let apiKey = "1266ad07b66517497b1acf79ea5a6a64";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

searchCity("Kyiv");
displayForecast();

function showWeather(response) {
  let city = document.querySelector("#city");
  celsiusTemperature = response.data.main.temp;

  let temperature = Math.round(response.data.main.temp);
  city.innerHTML = `${response.data.name}`;
  let temp = document.querySelector("#degrees-temp");
  if (isCelsius) {
    temp.innerHTML = `${temperature}`;
  } else {
    temp.innerHTML = `${Math.round(calculateFarengheit(temperature))}`;
  }
  let humid = document.querySelector("#humidity");
  humid.innerHTML = response.data.main.humidity;
  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed);
  let weatherDeskriptionElement = document.querySelector("#weatherDeskription");
  let weatherDeskription = response.data.weather[0].description;
  weatherDeskriptionElement.innerHTML =
    weatherDeskription.charAt(0).toUpperCase() + weatherDeskription.slice(1);
  let iconElement = document.querySelector("#mainIcon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function handlePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "1266ad07b66517497b1acf79ea5a6a64";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showWeather);
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
