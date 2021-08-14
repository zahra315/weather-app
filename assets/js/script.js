var apiKey = "17cae2557303445c31cf9d8e6e1694a1";
var historyArr = JSON.parse(localStorage.getItem("historyArr")) || [];

var searchFormEl = document.getElementById("search-form");
var searchInputEl = document.getElementById("search-input");
var historyContainerEl = document.getElementById("history-button-container");
var ciityHistoryButtons = document.querySelectorAll(".city-history");

var dateTodayEl = document.getElementById("today-date");
var cityNameEl = document.getElementById("city-name");
var currentIconEl = document.getElementById("current-icon");
var currentTempEl = document.getElementById("current-temp");
var currentHumidEl = document.getElementById("current-humidity");
var currentWindEl = document.getElementById("current-wind");
var currentUvEl = document.getElementById("current-uv");
var errorMessage = document.createElement("p");

searchFormEl.addEventListener("submit", getWeatherData);

function getWeatherData(event) {
  event.preventDefault();
  errorMessage.textContent = "";
  var searchCity = searchInputEl.value;
  searchInputEl.value = "";

  fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
      searchCity +
      "&limit=1&appid=" +
      apiKey
  )
    .then(function (geoResponse) {
      return geoResponse
        .json()
        .then(function (geoData) {
          var lat = geoData[0].lat;
          var lon = geoData[0].lon;
          var cityName = geoData[0].name;
          historyArr.push({ city: cityName, longitude: lon, latitude: lat });
          localStorage.setItem("historyArr", JSON.stringify(historyArr));
          fetch(
            "https://api.openweathermap.org/data/2.5/onecall?lat=" +
              lat +
              "&lon=" +
              lon +
              "&appid=" +
              apiKey +
              "&units=imperial"
          )
            .then(function (weatherResponse) {
              return weatherResponse
                .json()
                .then(function (weatherData) {
                  var currentWeather = {
                    city: cityName,
                    date: moment
                      .unix(weatherData.current.dt)
                      .format("MM/DD/YYYY"),
                    icon: weatherData.current.weather[0].icon,
                    temp: weatherData.current.temp,
                    humidity: weatherData.current.humidity,
                    wind: weatherData.current.wind_speed,
                    uvi: weatherData.current.uvi,
                  };

                  var fiveDayForecast = [];
                  for (var i = 1; i < 6; i++) {
                    var forecast = {
                      day: i,
                      date: moment
                        .unix(weatherData.daily[i].dt)
                        .format("MM/DD/YYYY"),
                      icon: weatherData.daily[i].weather[0].icon,
                      temp: weatherData.daily[i].temp.day,
                      humidity: weatherData.daily[i].humidity,
                    };
                    fiveDayForecast.push(forecast);
                  }

                  showWeatherSections();

                  displayWeatherData(currentWeather, fiveDayForecast);
                  makeCityButtons();
                })
                .catch((err) => {
                  errorMessage.textContent =
                    "Unsuccessful request. Please search again";
                  historyContainerEl.appendChild(errorMessage);
                  console.error(err);
                });
            })
            .catch((err) => {
              errorMessage.textContent =
                "Unsuccessful request. Please search again";
              historyContainerEl.appendChild(errorMessage);
              console.error(err);
            });
        })
        .catch((err) => {
          errorMessage.textContent =
            "Unsuccessful request. Please search again";
          historyContainerEl.appendChild(errorMessage);
          console.error(err);
        });
    })
    .catch((err) => {
      errorMessage.textContent = "Unsuccessful request. Please search again";
      historyContainerEl.appendChild(errorMessage);
      console.error(err);
    });
}

function showWeatherSections() {
  // Show this UI when after a search, when there is data to display
  document
    .querySelector(".weather-display")
    .setAttribute("style", "display: block");
  document
    .querySelector(".five-day-weather")
    .setAttribute("style", "display: flex");
}

function displayWeatherData(currentWeather, fiveDayForecast) {
  // Take the vars of weather data taken from the api and add them to the UI elements
  cityNameEl.textContent = currentWeather.city;
  dateTodayEl.textContent = currentWeather.date;
  currentIconEl.setAttribute(
    "src",
    "https://openweathermap.org/img/w/" + currentWeather.icon + ".png"
  );
  currentTempEl.textContent = currentWeather.temp;
  currentHumidEl.textContent = currentWeather.humidity;
  currentWindEl.textContent = currentWeather.wind;
  currentUvEl.textContent = currentWeather.uvi;
  styleUV(currentWeather.uvi);

  for (var i = 0; i < 5; i++) {
    document.getElementById("day" + (i + 1) + "-date").textContent =
      fiveDayForecast[i].date;
    document
      .getElementById("day" + (i + 1) + "-icon")
      .setAttribute(
        "src",
        "https://openweathermap.org/img/w/" + fiveDayForecast[i].icon + ".png"
      );
    document.getElementById("day" + (i + 1) + "-temp").textContent =
      fiveDayForecast[i].temp;
    document.getElementById("day" + (i + 1) + "-humidity").textContent =
      fiveDayForecast[i].humidity;
  }
}

function styleUV(currentUV) {
  if (currentUV <= 2) {
    // favorable UV index conditions
    currentUvEl.setAttribute("class", "badge bg-success");
  } else if (currentUV > 2 && currentUV <= 7) {
    // moderate UV index conditions
    currentUvEl.setAttribute("class", "badge bg-warning");
  } else if (currentUV >= 8) {
    // severe UV index conditions
    currentUvEl.setAttribute("class", "badge bg-danger");
  }
}

function makeCityButtons() {
  // Takes city history from local storage, and display the buttons on loading the page
  historyContainerEl.textContent = "";
  var storedCityInfo = JSON.parse(localStorage.getItem("historyArr"));
  if (storedCityInfo) {
    for (var i = 0; i < storedCityInfo.length; i++) {
      var cityButtonEl = document.createElement("button");
      cityButtonEl.setAttribute("type", "button");
      cityButtonEl.setAttribute("class", "city-history btn btn-primary");
      cityButtonEl.textContent = storedCityInfo[i].city;
      historyContainerEl.appendChild(cityButtonEl);
    }
  }
}
makeCityButtons();

historyContainerEl.addEventListener("click", function (event) {
  errorMessage.textContent = "";
  // Takes the stored data related to the history buttons, and calls the API with the saved lat, lon data
  var searchCity = event.target.textContent;
  var storedCityInfo = JSON.parse(localStorage.getItem("historyArr"));
  for (var i = 0; i < storedCityInfo.length; i++) {
    if (searchCity === storedCityInfo[i].city) {
      var lat = storedCityInfo[i].latitude;
      var lon = storedCityInfo[i].longitude;
    }
  }
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      apiKey +
      "&units=imperial"
  )
    .then(function (weatherResponse) {
      return weatherResponse
        .json()
        .then(function (weatherData) {
          var currentWeather = {
            city: searchCity,
            date: moment.unix(weatherData.current.dt).format("MM/DD/YYYY"),
            icon: weatherData.current.weather[0].icon,
            temp: weatherData.current.temp,
            humidity: weatherData.current.humidity,
            wind: weatherData.current.wind_speed,
            uvi: weatherData.current.uvi,
          };

          var fiveDayForecast = [];
          for (var i = 1; i < 6; i++) {
            var forecast = {
              day: i,
              date: moment.unix(weatherData.daily[i].dt).format("MM/DD/YYYY"),
              icon: weatherData.daily[i].weather[0].icon,
              temp: weatherData.daily[i].temp.day,
              humidity: weatherData.daily[i].humidity,
            };
            fiveDayForecast.push(forecast);
          }

          showWeatherSections();
          displayWeatherData(currentWeather, fiveDayForecast);
        })
        .catch((err) => {
          var errorMessage = document.createElement("p");
          errorMessage.textContent =
            "Unsuccessful request. Please search again";
          historyContainerEl.appendChild(errorMessage);
          console.error(err);
        });
    })
    .catch((err) => {
      var errorMessage = document.createElement("p");
      errorMessage.textContent = "Unsuccessful request. Please search again";
      historyContainerEl.appendChild(errorMessage);
      console.error(err);
    });
});
