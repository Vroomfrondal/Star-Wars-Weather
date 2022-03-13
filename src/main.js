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
    const id = 5780993 // salt lake city
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=5780993&appid=${config.OPEN_WEATHER_API_KEY}&units=imperial`)

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

    // populate DOM
    tempElement.textContent = `${filteredTemp}°F`
    descriptionElement.textContent = `It's ${description}, feels like`
    planetElement.textContent = determinePlanet(filteredTemp)

    console.log(weatherData) //debug
}

// Planet Algorithm will take into account temperature and forecast conditions and determine which planet to display
const determinePlanet = (filteredTemp) => {
    const imageElement = document.querySelector("#image-container")
    let planet

    // determine which planet to show
    if (filteredTemp <= 45) {
        planet = "Hoth"
        imageElement.classList.remove("bg-image")
        imageElement.classList.add("hoth-bg")
    } else if (filteredTemp >= 46 && filteredTemp <= 62) {
        planet = "Coruscant"
        imageElement.classList.remove("hoth-bg")
        imageElement.classList.remove("bg-image")
        imageElement.classList.add("coruscant-bg")
    } else if (filteredTemp >= 63 && filteredTemp <= 85) {
        planet = "Tattoine"
        imageElement.classList.remove("coruscant-bg")
        imageElement.classList.add("tattoine-bg")
    } else if (filteredTemp >= 86) {
        planet = "Bespin"
        imageElement.classList.remove("tattoine-bg")
        imageElement.classList.add("bespin-bg")
    } else {
        planet = "Coruscant"
        imageElement.classList.remove("bespin-bg")
        imageElement.classList.add(".coruscant-bg")
    }

    return planet
}

checkLocationPermission()
