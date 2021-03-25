const express = require("express");
const https = require("https");
const { urlencoded } = require("body-parser");

var path = require("path");
const { text } = require("express");

// get current location

// end- get current location

// server response
const app = express();
app.use(urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const city = req.body.cityName;
  const appId = "5b72839387d0a15411beea5e9048cf8f"
  const urlCity =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appId}&units=metric`;

    // requesting data from the api    
    https.get(urlCity, function (apiRes) {
    //do something with received data
    apiRes.on("data", function (data) {
      // when data is received convert the it to js object and get necessary values
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const feelsLike = weatherData.main.feels_like;

      console.log(temp, description, icon, feelsLike);
    });
  });
});

app.post("/locate", (req, res) => {
  // res.send("<h1>Location received!</h1>")
  const lat = req.body.latitude;
  const lon = req.body.longitude;
  const appId = "5b72839387d0a15411beea5e9048cf8f"
  const urlCoord = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`





  console.log(lat, lon);
});

app.listen(3000, () => {
  console.log("Server is running in port 3000");
});
