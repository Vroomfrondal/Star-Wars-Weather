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
const determinePlanet = (filteredTemp, conditions) => {
    const imageElement = document.querySelector("#image-container")
    const newImage = document.createElement("img")
    let planet

    // Determine which planet to show
    // Temperature
    // Weather Conditions
    if (filteredTemp < 60) {
        planet = "Endor"
        newImage.src = "/images/coruscant-night.jpg"
        imageElement.appendChild(newImage)
    }

    return planet
}

const render = (weatherData) => {
    const tempElement = document.querySelector("#temp")
    const descriptionElement = document.querySelector("#description")
    const planetElement = document.querySelector("#planet")
    const filteredTemp = weatherData.main.temp.toFixed()
    const description = weatherData.weather[0].description

    // populate DOM
    tempElement.textContent = `${filteredTemp}°`
    descriptionElement.textContent = `It's ${description}, feels like`
    planetElement.textContent = determinePlanet(filteredTemp)

    console.log(weatherData) //debug
}

checkLocationPermission()
