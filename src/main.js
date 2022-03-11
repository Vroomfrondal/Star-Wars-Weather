checkLocationPermission = () => {
    // get coordinates of user for use in Open Weather API
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            getWeather(position.coords.latitude, position.coords.longitude)
        })
    } else {
        console.log("Please enable location services in the browser to use this app.")
    }
}

//Used async/await because fetch returns a promise and I don't have to use .then :))
const getWeather = async (latitude, longitude) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${config.OPEN_WEATHER_API_KEY}&units=imperial`)
    // ensure API is up and running
    if (response.status === 200) {
        const weatherData = await response.json()
        render(weatherData)
    } else {
        console.log("error")
        throw new Error("Sorry, OpenWeather seems to be having issues with their API. Try again later.")
    }
}

// Planet Algorithm will take into account temperature and forecast conditions and determine which planet to display
determinePlanet = (filteredTemp) => {
    let planet

    if (filteredTemp > 60) {
        console.log("Display Planet")
        planet = "Hi"
    }

    return planet
}

const render = (weatherData) => {
    const tempElement = document.querySelector("#temp")
    const descElement = document.querySelector("#description")
    const planetElement = document.querySelector("#planet")
    const filteredTemp = weatherData.main.temp.toFixed()

    // populate DOM
    tempElement.textContent = filteredTemp
    descElement.textContent = weatherData.weather[0].description
    planetElement.textContent = determinePlanet(filteredTemp)

    console.log(weatherData) //debug
}
checkLocationPermission()
