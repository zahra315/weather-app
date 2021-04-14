var key = "17cae2557303445c31cf9d8e6e1694a1";
var currentCity = "";
var previousCity = "";


//display the current Weather 
var currentWeather = (event) => {
    let city = $('#cityName').val();
    currentCity= $('#cityName').val();
    let apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + key;
    fetch(apiURL)
    .then((response) => {
        return response.json();
    })
    .then((response) => {
        // Save city to local storage
        storeCityInfo(city);
        // Create icon for the current weather using Open Weather Maps
        let weatherIcon="https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        var currentMoment = moment();
       
        displayCities();
       
        fiveDayForecast(event);
        
        let weatherHTML = `
            <h3>${response.name} ${currentMoment.format("(MM/DD/YY)")}<img src="${weatherIcon}"></h3>
            <ul class="list-styled">
                <li>Temperature: ${response.main.temp}℉</li>
                <li>Humidity: ${response.main.humidity}%</li>
                <li>Wind Speed: ${response.wind.speed} mph</li>
                <li id="uvIndex">UV Index:</li>
            </ul>`;
       
        $('#current-weather').html(weatherHTML);
        let lat = response.coord.lat;
        let lon = response.coord.lon;
        let uvURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + key;
        fetch(uvURL)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            let uvIndex = response.value;
            $('#uvIndex').html(`UV Index: <span id="uvVal"> ${uvIndex}</span>`);
            if (uvIndex>=0 && uvIndex<3){
                $('#uvVal').attr("class", "uv-favorable");
            } else if (uvIndex>=3 && uvIndex<8){
                $('#uvVal').attr("class", "uv-moderate");
            } else if (uvIndex>=8){
                $('#uvVal').attr("class", "uv-severe");
            }
        });
    })
}



//save the city to localStorage
var storeCityInfo = (newCity) => {
    let cityExists = false;
    // Check if City exists in local storage
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage["cities" + i] === newCity) {
            cityExists = true;
            break;
        }
    }
    if (cityExists === false) {
        localStorage.setItem('cities' + localStorage.length, newCity);
    }
}

//list of searched cities
var displayCities = () => {
    $('#listOfCities').empty();
    
    if (localStorage.length===0){
        $('#cityName').attr("value", "City!");
    } else {
        for (let i = 0; i < localStorage.length; i++) {
            let city = localStorage.getItem("cities" + i);
            let cityEl = `<button type="button" class="list-group-item list-group-item-action">${city}</button></li>`;

            $('#listOfCities').prepend(cityEl);
        }
        
    }
    
}

// New city search listener
$('#search-button').on("click", (event) => {
    event.preventDefault();
    currentCity = $('#cityName').val();
    currentWeather(event);
    });
    