const express = require("express");
const https = require("https");
const { urlencoded } = require("body-parser");

var path = require("path");

// get current location

// end- get current location

// server response
const app = express();
app.use(urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=Cavite&appid=5b72839387d0a15411beea5e9048cf8f&units=metric";
  https.get(url, function (apiRes) {
    apiRes.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const feelsLike = weatherData.main.feels_like;

      console.log(temp, description, icon, feelsLike);
    });
  });
});

app.listen(3000, () => {
  console.log("Server is running in port 3000");
});
