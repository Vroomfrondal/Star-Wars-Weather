const searchCityElement = document.querySelector("#city-search")

// get coordinates of device for use in API
const checkLocationPermission = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                getCurrentWeather(position.coords.latitude, position.coords.longitude)
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert("Turn on location services or open the website on desktop")
                        break
                    case error.POSITION_UNAVAILABLE:
                        alert("Turn on location services or open the website on desktop")
                        break
                    case error.TIMEOUT:
                        alert("Turn on location services or open the website on desktop")
                        break
                    case error.UNKNOWN_ERROR:
                        alert("Turn on location services or open the website on desktop")
                        break
                }
            }
        )
    } else {
        console.log("Please enable location services in the browser to use this app.")
    }
}

// Searching a custom city based on user input
searchCityElement.addEventListener("search", (e) => {
    const cityName = `${searchCityElement.value.toLowerCase()}`
    searchCity(cityName)
})

const searchCity = async (cityName) => {
    const searchCityResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${config.OPEN_WEATHER_API_KEY}&units=imperial`)

    // render response to screen if status is "OK"
    if (searchCityResponse.status === 200) {
        const cityData = await searchCityResponse.json()

        //console.log("City data:", cityData.name)
        renderDOM(cityData)
    } else {
        searchCityElement.value = ""
        throw new Error("Sorry, OpenWeather seems to be having issues with their API. Try again later.")
    }
}

// Async is promised based. Can use async/await instead of .then
const getCurrentWeather = async (latitude, longitude) => {
    const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${config.OPEN_WEATHER_API_KEY}&units=imperial`)

    // render response to screen if status is "OK"
    if (currentWeatherResponse.status === 200) {
        const currentWeatherData = await currentWeatherResponse.json()
        renderDOM(currentWeatherData)
    } else {
        throw new Error("Sorry, OpenWeather seems to be having issues with their API. Try again later.")
    }
}

const renderDOM = (currentWeatherData) => {
    const tempElement = document.querySelector("#temp")
    const planetElement = document.querySelector("#planet")
    //const descriptionElement = document.querySelector("#description")
    const filteredTemp = currentWeatherData.main.temp.toFixed()
    const conditions = currentWeatherData.weather[0].main

    planetElement.textContent = determinePlanet(filteredTemp, conditions)
    tempElement.textContent = determineWeatherMessage(planet, filteredTemp, conditions)
    //descriptionElement.textContent = determineFunMessage(planet)

    // debug
    console.log("Weather Data:", currentWeatherData)
}

// Planet Algorithm will take into account temperature and forecast conditions and determine which planet to display
const determinePlanet = (filteredTemp, conditions) => {
    let planet

    // Determine conditions, if none, run temp algo
    if (conditions === "Rain") {
        planet = "Kamino"
        updateImage("kamino-bg")
    } else if (conditions === "Mist" || conditions === "Fog") {
        planet = "Endor"
        updateImage("endor-bg")
    } else {
        if (filteredTemp <= 40) {
            planet = "Hoth"
            updateImage("Hoth-bg")
        } else if (filteredTemp <= 50) {
            planet = "Naboo"
            updateImage("naboo-bg-warmer")
        } else if (filteredTemp <= 65) {
            planet = "Coruscant"
            updateImage("coruscant-bg")
        } else if (filteredTemp <= 72) {
            planet = "Scariff"
            updateImage("scariff-bg")
        } else if (filteredTemp <= 78) {
            planet = "Tattoine"
            updateImage("tattoine-bg")
        } else if (filteredTemp <= 90) {
            planet = "Bespin"
            updateImage("bespin-bg")
        } else {
            planet = "Kashyyk"
            updateImage("kashyyk-bg")
        }
    }
    return planet
}

const determineWeatherMessage = (planet, filteredTemp, conditions) => {
    const currPlanet = planet.textContent.toLowerCase()
    const currWeather = ` ${filteredTemp}°F, ${conditions}?`
    let message = ""

    if (currPlanet === "kamino") {
        message = `Wow. ${currWeather}`
    } else if (currPlanet === "endor") {
        message = `Hmm. ${currWeather}`
    } else if (currPlanet === "hoth") {
        message = `Oh my. ${currWeather}`
    } else if (currPlanet === "naboo") {
        message = `Oh. ${currWeather}`
    } else if (currPlanet === "tattoine") {
        message = `Whew. ${currWeather}`
    } else if (currPlanet === "bespin") {
        message = `Yikes. ${currWeather}`
    } else {
        message = `Ahh. ${currWeather}`
    }

    return message
}

// Dynamically apply CSS background to according planet
updateImage = (nameOfClass) => {
    const imageElement = document.querySelector("#image-container")

    imageElement.className = ""
    imageElement.classList.add(nameOfClass)
}

checkLocationPermission()

// Todo:
// 1) complete determineWeatherMessage() based on current weather by updating #description element.
