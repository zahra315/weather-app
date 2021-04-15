# Weather Dashboard

Weather-Dashboard is an application to find a weather condition of a given city both the current and 5-Days forecast at the same time. The server-side API used to get response data object is retrieved from the Open Weather APi. The current weather section is including the following weather characters and date.

<ul>
  <li>City, Date, Icon-image</li>
  <li>Temperature</li>
  <li>Humidity</li>
  <li>Wind Speed</li>
  <li>UV index</li>
</ul>

The 5-days weather forecast also displays below the current weather conditions section and it includes the following information for each day:

<ul>
  <li>Date</li>
  <li>Icon image</li>
  <li>Temperature</li>
  <li>Humidity</li>
</ul>


The local storage is used here to store the previous search city and display them to the user in the left side of the page under the list group. If the user wants to see the past search city weather condition again, just click the list group item cities under the clear history button.

## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```

<h2><a href="https://zahra315.github.io/weather-app/">Weather Dashboard</a></h2>
<p align="center">
  <img src="https://github.com/zahra315/weather-app/blob/main/assets/img/01.jpg" width="50%">
</p>
