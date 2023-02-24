require("dotenv").config();
const express = require("express");
const https = require("https");
const { urlencoded } = require("body-parser");
const ct = require("countries-and-timezones");
var path = require("path");
const { text } = require("express");

// server response
const app = express();
app.use(urlencoded({ extended: true }));
app.use(express.static("public")); //path.join(__dirname, "/public"))
app.use(express.json({ limit: "1mb" }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

const appId = process.env.API_KEY;

app.post("/", function (req, res) {
  const city = req.body.cityName;
  console.log("city", city);
  // const unit = req.body.requestedUnit ? "imperial" : "metric";
  const unit = "metric";
  const locatorClicked = req.body.locatorClicked;
  const getJSONData = req.body.getJSONData; // not needed

  try {
    let url = "";
    if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appId}&units=${unit}`;
      requestData(url, res, unit, getJSONData);
      console.log("data requested through input");
    } else if (!city && locatorClicked) {
      const lat = req.body.lat;
      const lon = req.body.lon;
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}&units=${unit}`;
      requestData(url, res, unit, getJSONData);
      console.log("getting location using gps");
    } else {
      res.send("enter a valid location");
    }
    console.log("url", url);
  } catch (error) {
    console.log({ error });
    res.send("Failed to fetch data");
  }
});

function requestData(url, res, unit, getJSONData) {
  // requesting data from the api
  https.get(url, function (apiRes) {
    //do something with received data

    apiRes.on("data", function (data) {
      // when data is received convert the it to js object and get necessary values
      const weatherData = JSON.parse(data);
      console.log("weather data", weatherData);
      const cod = weatherData.cod;
      if (cod == 200) {
        const temp = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const feelsLike = weatherData.main.feels_like;
        const main = weatherData.weather[0].main;
        const country = weatherData.sys.country;
        const place = weatherData.name;
        const icon = weatherData.weather[0].icon;
        const sunrise = weatherData.sys.sunrise;
        const sunset = weatherData.sys.sunset;
        const timezone = ct.getCountry(country).timezones[0];
        let iconClass = "";
        let tempUnit = unit === "metric" ? "°C" : "°F";

        if (icon.includes("d")) {
          //get day or night icon
          iconClass = `wi wi-owm-day-${weatherData.weather[0].id}`;
        } else if (icon.includes("n")) {
          iconClass = `wi wi-owm-night-${weatherData.weather[0].id}`;
        }

        const importantData = {
          main,
          place,
          country,
          iconClass,
          feelsLike,
          description,
          temp,
          tempUnit,
          timezone,
          status: cod,
          sunrise,
          sunset,
        };
        console.log("data sent!");

        res.render("index", importantData);
        console.log("html response sent");
      } else {
        res.render("index", {
          error: "Location not found!",
          status: cod,
        });
      }
    });
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running at port ${port}`);
});
