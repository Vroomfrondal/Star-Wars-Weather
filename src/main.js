const checkLocationPermission = () => {
    // get coordinates of user for use in Open Weather API
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                getWeather(position.coords.latitude, position.coords.longitude)
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

//Used async/await because fetch returns a promise and I don't have to use .then :))
const getWeather = async (latitude, longitude) => {
    // Use geolocation coordinates in fetch
    //const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${config.OPEN_WEATHER_API_KEY}&units=imperial`)

    // Test Variables Remove before deployment
    const id = 5809844
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${config.OPEN_WEATHER_API_KEY}&units=imperial`)

    // ensure API is up and running
    if (response.status === 200) {
        const weatherData = await response.json()
        render(weatherData)
    } else {
        throw new Error("Sorry, OpenWeather seems to be having issues with their API. Try again later.")
    }
}

const render = (weatherData) => {
    const tempElement = document.querySelector("#temp")
    const descriptionElement = document.querySelector("#description")
    const planetElement = document.querySelector("#planet")
    const filteredTemp = weatherData.main.temp.toFixed()
    const description = weatherData.weather[0].description
    const conditions = weatherData.weather[0].main // will contain: "Rain", "Clouds"

    // populate DOM
    tempElement.textContent = `${filteredTemp}°F`
    descriptionElement.textContent = `It's ${description}, feels like`
    planetElement.textContent = determinePlanet(filteredTemp)

    console.log(weatherData) //debug
    console.log(conditions)
}

// Planet Algorithm will take into account temperature and forecast conditions and determine which planet to display
const determinePlanet = (filteredTemp, conditions) => {
    let planet

    // if ((conditions = "Rain")) {
    //     planet = "Kamino"
    //     updateImage("kamino-bg")
    // } else if (conditions = "Clouds") {
    //     planet =
    // }

    //Temperature conditions
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

    // Rain Conditions

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
// add rain and fog into algorithm that determines weather
//    to include conditions into algo, you need to use || in some of the temp algos
//    rain = endor, clear = ?
// Fix header
// Add Fonts
// add default image to start when API is loading
