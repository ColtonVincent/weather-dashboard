const searchSubmitEl = $("#search-submit");
const searchFormEl = $("#search-form");
const searchHistory = $('#search-history');
const contact=$('#contact');

function getData(lat, lon, APIKey, city){

    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + APIKey

    fetch(apiUrl).
    then(function (response) {
        if (!response.ok) {
            console.log("No response")
            alert('not a city')
            throw response.json()
        }
        return response.json()
    })
    .then(function (data){
        console.log(data)
        
        var currentCityEl = $("#0currentCity");
        currentCityEl.text(city);
        
        var uvi = data.current.uvi;
        var uviEl = $('#uv');
        uviEl.text(uvi)

        if (uvi < 5){
            uviEl.attr("class", "bg-success")
        } else if (uvi > 7){
            uviEl.attr("class", 'bg-danger')
        } else {
            uviEl.attr("class", 'bg-warning')
        }

        // Adds content to the current weather card and the forecast cards
        for(i = 0; i < 6; i ++){
            
            var dateEl = $('#'+i+"date");
            dateEl.text("  " + moment().add(i, 'days').format('MMM Do'));

            var icon = data.daily[i].weather[0].icon;
            var iconAlt = data.daily[i].weather[0].description;
            var iconURL = 'https://openweathermap.org/img/wn/'+icon+'@2x.png';
            var iconEl = $('#'+i+'icon');
            iconEl.attr('src', iconURL);
            iconEl.attr('alt', iconAlt)

            var maxTemp = Math.floor((data.daily[i].temp.max-273.15)*1.8)+32;
            var minTemp = Math.floor((data.daily[i].temp.min-273.15)*1.8)+32;
            var temp = $("#"+i+"temp");
            temp.text( maxTemp + "° / " + minTemp + '°');

            var wind_speed = Math.floor(data.daily[i].wind_speed);
            var wind = $('#'+i+'wind');
            wind.text(wind_speed+" MPH")
            
            var humidity = data.daily[i].humidity;
            var hum = $('#'+i+'hum');
            hum.text(humidity+'% Humidity')
        }
    })
}


function getLatLon(city) {
    city.trim();
    // api key from openweathermap api
    var APIKey = '044bb9c5369619c2020f969f5078b5a5'
    
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(apiUrl).
        then(function (response) {
            if (!response.ok) {
                console.log("bad response")
                alert('not a city')
                throw response.json()
            }
            return response.json()
        })

        .then(function (data) {
            console.log(data)
            var lat = data.coord.lat;
            var lon = data.coord.lon;

           getData(lat, lon, APIKey, city)
        })
    }
   
    // displays the list of cities searched
function renderCityList(city){    
        var li = $('<li></li>').text(city);
        var searchHistory = $('#search-history');
        li.attr('class', 'list-group-item list-group-item-action list-group-item-primary list-custom')

        searchHistory.append(li);
}


function handleSearchFormSubmit(event) {
    event.preventDefault();

    var searchInputVal = $("#search-input").val().trim();

    if (!searchInputVal) {
        alert("No input value")
        console.error("No input value")
        return
    };

    var city = searchInputVal;
    console.log(city);

    getLatLon(city);
    renderCityList(city);
}


function clickEvent(event){
   var city = event.target.innerHTML;
    console.log(city)
   getLatLon(city)
}


searchHistory.on('click', clickEvent)
searchSubmitEl.on("submit", handleSearchFormSubmit);