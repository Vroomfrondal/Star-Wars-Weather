const checkLocationPermission = () => {
    // get coordinates of user for use in Open Weather API
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

// Fetch returns a promise and I don't have to use .then :))
const getCurrentWeather = async (latitude, longitude) => {
    // Fetches
    const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${config.OPEN_WEATHER_API_KEY}&units=imperial`)
    const fiveDayForcastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${config.OPEN_WEATHER_API_KEY}&units=imperial`)

    // Test Variables. Remove before deployment
    //const id = 5809844
    //const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${config.OPEN_WEATHER_API_KEY}&units=imperial`)

    // ensure API is up and running
    if (currentWeatherResponse.status === 200 && fiveDayForcastResponse.status === 200) {
        const currentWeatherData = await currentWeatherResponse.json()
        const fiveDayWeatherData = await fiveDayForcastResponse.json()
        render(currentWeatherData, fiveDayWeatherData)
    } else {
        throw new Error("Sorry, OpenWeather seems to be having issues with their API. Try again later.")
    }
}

const render = (currentWeatherData, fiveDayForcastResponse) => {
    const tempElement = document.querySelector("#temp")
    const descriptionElement = document.querySelector("#description")
    const planetElement = document.querySelector("#planet")
    const filteredTemp = currentWeatherData.main.temp.toFixed()
    const conditions = currentWeatherData.weather[0].main
    const description = currentWeatherData.weather[0].description

    // populate DOM
    tempElement.textContent = `${filteredTemp}°F`
    descriptionElement.textContent = `It's ${description}, feels like the planet...`
    planetElement.textContent = determinePlanet(filteredTemp, conditions)

    //debug
    console.log("Current", currentWeatherData)
    console.log("Five Day:", fiveDayForcastResponse)
}

// Planet Algorithm will take into account temperature and forecast conditions and determine which planet to display
const determinePlanet = (filteredTemp, conditions) => {
    let planet

    console.log(conditions)
    // conditions: rain, mist, clear, clouds
    if (conditions === "Rain") {
        planet = "Kamino"
        updateImage("kamino-bg")
    } else if (conditions === "Mist") {
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
            planet = "Naboo"
            updateImage("naboo-bg")
        } else if (filteredTemp <= 70) {
            planet = "Scariff"
            updateImage("scariff-bg")
        } else if (filteredTemp <= 75) {
            planet = "Coruscant"
            updateImage("coruscant-bg")
        } else if (filteredTemp <= 81) {
            planet = "Tattoine"
            updateImage("tattoine-bg")
        } else if (filteredTemp <= 86) {
            planet = "Bespin"
            updateImage("bespin-bg")
        } else {
            planet = "Kashyyk"
            updateImage("kashyyk-bg")
        }
    }
    return planet
}

//utility functions
updateImage = (nameOfClass) => {
    const imageElement = document.querySelector("#image-container")

    imageElement.className = ""
    imageElement.classList.add(nameOfClass)
}

checkLocationPermission()

//todo:
// create 5 day forecast cards.
// Fix header - lower padding
// add default image to start when API is loading
// Mobile viewport / clamp in CSS

// to make 5-day-forecast-cards, in psuedocode:
// need 5 diff divs (dom objects to render each day to)
// Create CSS for card container
//      CSS card container will need flexbox

// what to do with rendered 5 day forcast: take high and low from each day and render onto a card
// take low from start of day, take high from mid day (peak sunlight)
// low will be on index 0.
// high will be on index 3
// in API response, every 7th index is a new day.
