$(document).ready(function () {
    var api_key = "87d25a44ab87e457149219fa0268ade3"
    var localStorageKey = "search_history";

    function setUvi(uvi) {
        $("#uvi").text(uvi);
        if (uvi < 3) {
            $("#uvi").css("background-color", "green");
        } else if (3 <= uvi && uvi < 6) {
            $("#uvi").css({
                "background-color": "yellow",
                "color": "black"
            });
        } else if (6 <= uvi && uvi < 8) {
            $("#uvi").css("background-color", "orange");
        } else if (8 <= uvi && uvi < 11) {
            $("#uvi").css("background-color", "red");
        } else if (uvi >= 11) {
            $("#uvi").css("background-color", "violet");
        } else {
            $("#uvi").css("background-color", "white");
        }
    }

    function getData(city_name) {
        $.ajax({
            type: "POST",
            url: `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${api_key}`,
            dataType: "json",
            success: function (result) {
                console.log(result);
                var city = result.name;
                var offset = result.timezone;
                var current_date = moment.unix(result.dt + offset).format("l");
                var current_temp = result.name;
                $("#cityName").text(`${city} (${current_date})`);
                $("#weather-icon-header").attr("src", `http://openweathermap.org/img/wn/${result.weather[0].icon}.png`)
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
                setUvi(result.current.uvi);
                showForecast(result);
            }
        });
    }

    function showForecast(data) {
        $(".forecast").each(function (idx, elem) {
            var offset = data.timezone_offset;
            var actual_time = data.daily[idx + 1].dt + offset;

            // $(this).children(".date").text(moment().add(idx + 1, "days").format("l"));
            $(this).children(".date").text(moment.unix(actual_time).format("l"));
            $(this).children(".icon").attr("src", `http://openweathermap.org/img/wn/${data.daily[idx].weather[0].icon}@2x.png`)
            console.log($(this).children(".temp-parent").children(".temp"));
            $(this).children(".temp-parent").children(".temp").text(data.daily[idx + 1].temp.day);
            $(this).children(".humidity-parent").children(".humidity").text(data.daily[idx + 1].humidity);
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

        if (searchHistory !== null) {
            getData(searchHistory[searchHistory.length - 1]);

            for (var i = 0; i < searchHistory.length; i++) {
                var elem = $("<li>").attr("class", "list-group-item").text(searchHistory[i]);
                $("#search-history").prepend(elem);
            }
        }


    }

    getOldData();

    $("#searchBtn").click(function (e) {
        var query = $(this).siblings("#searchbox").val();
        var elem = $("<li>").attr("class", "list-group-item").text(query);
        $("#search-history").prepend(elem);
        setLocalStorage(localStorageKey, query);
        getData(query);
    });

    $(".list-group-item").click(function (e) {
        var query = $(this).text();
        var elem = $("<li>").attr("class", "list-group-item").text(query);
        $("#search-history").prepend(elem);
        setLocalStorage(localStorageKey, query);
        getData(query);
    });


});