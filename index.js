let searchBox = document.createElement('div');

function createSearchBox() {
    searchBox.innerHTML = 
        `<div class ="card">
            <h2>Weather Report - a fast and simple weather viewer</h2>
            <p>Write the name of the city in the search bar</p>
            <div class="search">
                <input type="text" class="searchbar" placeholder="Search a city..." id="input"> 
                    <button><img src="search-icon.png" class="searchicon"></img></button>
                    <ul class="list"></ul>
                </input>
            </div>
        </div>`;
    document.body.insertAdjacentElement('afterbegin', searchBox);
}

function modifySearchBox() {
    searchBox.innerHTML = 
        `<div class="card">
            <div class="search">
                <input type="text" class="searchbar" id="input">
                    <button><img src="search-icon.png" class="searchicon"></img></button>
                    <ul class="list"></ul>
            </div>
                <div class="weatherinfo">
                    <div class="city"></div>
                    <div class="temperature"></div>
                    <div class="description"></div>
                    <div class="fivedayforecast">
                        <button>Get 5 day forecast</button>
                    </div>
            </div>
        </div>`;
    createEventListener();
    createAutoCompleteList();
}

let weather = {
    "apiKey": "",
    fetchLocation: function(city) {
        fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + this.apiKey)
        .then((response) => response.json())
        .then((data) => this.fetchWeather(data));
    },
    fetchWeather: function(data) {
        const {lon, lat, name} = data[0];
        fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + this.apiKey)
        .then((response) => response.json())
        .then((data) => {
            this.displayWeather(data, name, lon, lat);
        });
    },
    displayWeather: function(data, name, lon, lat) {
        modifySearchBox();
        var fiveDayForecastURL = createFiveDayForecastLink(lon, lat);

        const {temp} = data.main;
        const {main} = data.weather[0];

        document.querySelector(".city").innerText = name;
        document.querySelector(".temperature").innerText = temp + " °C";
        document.querySelector(".description").innerText = main;
        document.querySelector(".fivedayforecast button").addEventListener('click', function() {
            document.querySelector(".fivedayforecast button").onclick = goToLink(fiveDayForecastURL);
        });
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')"
    }, 
    search: function() {
        this.fetchLocation(document.querySelector(".searchbar").value);
    }
};

createSearchBox();
createAutoCompleteList();
createEventListener();

function createEventListener() {
    document.querySelector(".search button").addEventListener('click', function() {
        weather.search();
    });

    document.querySelector(".searchbar").addEventListener('keyup', function(event) {
        if(event.key == "Enter") {
            weather.search();
        }
    })
}

function createFiveDayForecastLink(lon, lat) {
    var fiveDayForecastURL = "https://weather.com/weather/today/l/" + lat + "," + lon + "?par=google";
    
    return fiveDayForecastURL;
} 

function goToLink(url) {
    window.location = url;
}

function createAutoCompleteList() {
    let cityNames =['Abu Dhabi', 'Ankara', 'Amsterdam', 'Andorra la Vella', 'Athens', 'Baku', 'Bratislava', 'Belgrad', 'Brussels', 'Budapest', 'Bucharest', 'Bern', 'Chișinău', 'Copenhagen', 'Constanța', 'Cannes', 'Dublin', 'Davenport', 'Denver', 'Dubai', 'Doha', 'Eforie', 'Edinburgh', 'Florence', 'Fetești', 'Frankfurt', 'Galați', 'Genova', 'Gibraltar', 'Hunedoara', 'Hamburg', 'Hanoi', 'Iowa', 'Iași', 'Istanbul', 'Jakarta', 'Jacksonville', 'Kabul', 'Kingston', 'Kyiv', 'Kyoto', 'Kuala Lumpur', 'Lisbon', 'Ljubljana', 'London','Monaco', 'Minsk', 'Milan', 'Moscow', 'Mexico City', 'Madrid', 'Naples', 'New York', 'Nashville', 'New Orleans', 'New Delhi', 'Nicosia', 'Ottawa', 'Orlando', 'Oradea', 'Odessa', 'Oslo', 'Ontario', 'Prague', 'Paris', 'Podgorica', 'Rome', 'Riga', 'Reykjavik', 'Stockholm', 'San Marino', 'San Francisco', 'Sofia', 'Sarajevo', 'Sibiu', 'Sinaia', 'Tallin', 'Tbilisi', 'Tulcea', 'Utica', 'Utrecht', 'Vienna', 'Vilnius', 'Vaduz', 'Valletta', 'Vatican', 'Venice', 'Warsaw', 'Waterloo', 'Xanthi', 'Yerevan', 'Yorkshire', 'Zurich', 'Zanzibar'];
    let input = document.getElementById('input');

    input.addEventListener('keyup', (e) => {
        removeElements();

        if(input.value.length >= 3) {
            for(let i of cityNames) {
                if(i.toLocaleLowerCase().startsWith(input.value.toLocaleLowerCase()) && input.value != "") {
                    let listItem = document.createElement('li');
                    listItem.classList.add("list-items");
                    listItem.style.cursor = "pointer";
                    listItem.setAttribute('onclick', "displayNames('" + i + "')");

                    let word = "<b>" + i.substr(0, input.value.length) + "</b>";
                    word += i.substr(input.value.length);

                    listItem.innerHTML = word;
                    document.querySelector(".list").appendChild(listItem);
                }
            }
        }
    });
}

function displayNames(value) {
    input.value = value;
}

function removeElements() {
    let items = document.querySelectorAll(".list-items");

    items.forEach((item) => {
        item.remove();
    });
}