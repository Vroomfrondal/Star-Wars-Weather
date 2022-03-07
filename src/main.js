getLocation = () => {
    // get coordinates of user for use in Open Weather API
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            getWeather(position.coords.latitude, position.coords.longitude)
        })
    } else {
        console.log("Please enable location services in the browser to use this app.")
    }
}

getWeather = async (latitude, longitude) => {
    // fetch OpenWeather API based on user's coordinates
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=6db2a3f65fec5bc47108235e85affbc9&units=imperial`)

    // ensure API is up and running
    if (response.status === 200) {
        const weatherData = await response.json()

        // console.log(`Weather for ${weatherData.name}:`)
        // console.log(weatherData)
        render(weatherData)
    } else {
        throw new Error("Sorry, OpenWeather seems to be having issues with their API. Try again later.")
    }
}

const render = (weatherData) => {}

getLocation()
