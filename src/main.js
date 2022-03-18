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
                        alert("Please enable location in device and browser settings to get local weather.")
                        break
                    case error.POSITION_UNAVAILABLE:
                        alert("Please enable location in device and browser settings to get local weather.")
                        break
                    case error.TIMEOUT:
                        alert("Please enable location in device and browser settings to get local weather.")
                        break
                    case error.UNKNOWN_ERROR:
                        alert("Please enable location in device and browser settings to get local weather.")
                        break
                }
            }
        )
    } else {
        alert("Please enable location services to get local weather.")
        console.log("Please enable location services in the browser to use this app.")
    }
}

// Searching a custom city based on user input
searchCityElement.addEventListener("search", (e) => {
    e.preventDefault() // ??

    const cityName = `${searchCityElement.value.toLowerCase()}`
    searchCity(cityName)
})

const searchCity = async (cityName) => {
    const searchCityResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${config.OPEN_WEATHER_API_KEY}&units=imperial`)

    // render response to screen if status is "OK"
    if (searchCityResponse.status === 200) {
        const cityData = await searchCityResponse.json()
        console.log("City data:", cityData.name)
        renderDOM(cityData)
    } else {
        searchCityElement.value = ""
        searchCityElement.placeholder = "Try a different city."
        throw new Error("Try again later or try a new city.")
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
    const descriptionElement = document.querySelector("#description")
    const filteredTemp = currentWeatherData.main.temp.toFixed()
    const conditions = currentWeatherData.weather[0].main

    planetElement.textContent = determinePlanet(filteredTemp, conditions)
    tempElement.textContent = determineTempMessage(planet, filteredTemp, conditions)
    descriptionElement.textContent = determineDescription(planet)

    // debug
    console.log("Weather Data:", currentWeatherData)
}

// Planet Algorithm will take into account temperature and forecast conditions and determine which planet to display
const determinePlanet = (filteredTemp, conditions) => {
    let planet

    // Determine conditions, if none, run temp algo
    if (conditions === "Rain" || conditions === "Thunderstorm") {
        planet = "Kamino"
        updateImage("kamino-bg")
    } else if (conditions === "Mist" || conditions === "Fog") {
        planet = "Endor"
        updateImage("endor-bg")
    } else {
        if (filteredTemp <= 35) {
            planet = "Hoth"
            updateImage("Hoth-bg")
        } else if (filteredTemp <= 55) {
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

// Dynamically decide which DOM messages to apply
const determineTempMessage = (planet, filteredTemp, conditions) => {
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

const determineDescription = (planet) => {
    const currPlanet = planet.textContent.toLowerCase()
    let description = ""

    if (currPlanet === "kamino") {
        description = "Wet."
    } else if (currPlanet === "endor") {
        description = "Temperate foggy. Watch for Ewok's"
    } else if (currPlanet === "hoth") {
        description = "Cold, Icy, Freezing Desolation."
    } else if (currPlanet === "naboo") {
        description = "Temperate, dry, and fairly pleasant"
    } else if (currPlanet === "coruscant") {
        description = "Jedi meeting present. But outside is beautifully calm."
    } else if (currPlanet === "scariff") {
        description = "Cloudy, clear, and beautiful outside."
    } else if (currPlanet === "tattoine") {
        description = "Hot, Dry, Occasional Sarlacc."
    } else if (currPlanet === "bespin") {
        description = "Visit Mos Eisley for a drink, its HOT."
    } else {
        description = "Firing up the Millennium Falcon"
    }

    return description
}

// Dynamically apply CSS background to according planet
const updateImage = (nameOfClass) => {
    const imageElement = document.querySelector("#image-container")

    imageElement.className = ""
    imageElement.classList.add(nameOfClass)
}

checkLocationPermission()

// Todo:
// 1) complete determineWeatherDescription() based on current weather by updating #description element.
// 2) create mobile viewports
// 3) check when user clears search button and call localweather()
