$(document).ready(function () {
    var api_key = "87d25a44ab87e457149219fa0268ade3"
    var localStorageKey = "search_history";

    function getData(city_name) {
        $.ajax({
            type: "POST",
            url: `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${api_key}`,
            dataType: "json",
            success: function (result) {
                console.log(result);
                var city = result.name;
                var current_date = moment.unix(result.dt).format("l");
                var current_temp = result.name;
                $("#cityName").text(`${city} (${current_date})`);

                getForecast(result.coord.lat, result.coord.lon);
            }
        });
    }

    function getForecast(lat, lon) {
        $.ajax({
            type: "POST",
            url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,minutely&appid=${api_key}`,
            dataType: "json",
            success: function (result) {
                console.log(result);
                $("#temp").text(result.current.temp);
                $("#humidity").text(result.current.humidity);
                $("#windSpeed").text(result.current.wind_speed);
                $("#uvi").text(result.current.uvi)
            }
        });
    }


    function setLocalStorage(key, value) {
        var temp = getLocalStorage(key);
        // If there is already a saved key by the same name then append to the current key
        if (temp !== null) {
            temp.push(value);
            window.localStorage.setItem(key, JSON.stringify(temp));
        } else {
            var data = [value]
            window.localStorage.setItem(key, JSON.stringify(data));
        }
    }

    function getLocalStorage(key) {
        return JSON.parse(window.localStorage.getItem(key));
    }

    function clearLocalStorage() {
        window.localStorage.clear();
        location.reload();
    }

    function getOldData() {
        var searchHistory = getLocalStorage(localStorageKey);

        for (var i = 0; i < searchHistory.length; i++) {
            var elem = $("<li>").attr("class", "list-group-item").text(searchHistory[i]);
            $("#search-history").prepend(elem);
        }
    }

    getOldData();

    $("#searchBtn").click(function (e) {
        var query = $(this).siblings("#searchbox").val();
        var elem = $("<li>").attr("class", "list-group-item").text(query);
        $("#search-history").prepend(elem);
        setLocalStorage(localStorageKey, query)
        getData(query);
    });

});