//change bg based on time of the day
document.addEventListener("DOMContentLoaded", function (event) {
  setBackground();
});

//get location and fetch response
const locateButton = document.getElementById("locate-me");

locateButton.addEventListener("click", function () {
  //make sure to delete error text
  const errorEl = document.getElementById("invalid-location");
  if (errorEl) {
    errorEl.innerHTML = "";
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      let data = { lat, lon, locatorClicked: true };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      };

      //loading state
      const dataCont = document.getElementById("data-cont");
      const spinner = document.getElementById("spinner");
      console.log({
        spinner,
        dataCont: dataCont.classList,
      });

      //sending and getting data to server
      try {
        spinner.classList.remove("visually-hidden");
        dataCont.classList.add("visually-hidden");
        const url = await fetch("/", options);
        //response from server
        const html = await url.text();
        //convert html to DOM object
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");

        //get weather info
        const weatherInfo = doc.getElementById("weather-info");
        const dateTime = doc.getElementById("date-time");
        const unitSwitch = doc.getElementById("unit-switch");
        //inject inside the html element
        const indexWI = document.getElementById("weather-info");
        const indexDT = document.getElementById("date-time");
        const indexUS = document.getElementById("unit-switch");

        //check if the html elements exist
        if (indexUS && indexDT && indexWI) {
          indexWI.innerHTML = weatherInfo.innerHTML;
          indexDT.innerHTML = dateTime.innerHTML;
          indexUS.innerHTML = unitSwitch.innerHTML;
        } else {
          errorEl.parentNode.insertBefore(dataCont, errorEl.nextSibling);
        }

        //get DateTime of location
        getDateTime();
        //change bg
        setBackground();
        //convert unix time
        convertUnix(doc);
      } catch (error) {
        console.log("something went wrong while retrieving response", error);
      }

      //stop loading state
      spinner.classList.add("visually-hidden");
      dataCont.classList.remove("visually-hidden");
    });
  } else {
    console.log("unable to get location");
  }
});

//send location name to server
const form = document.getElementById("form");

form.addEventListener("submit", async function (e) {
  const spinner = document.getElementById("spinner");
  const dataCont = document.getElementById("data-cont");

  try {
    e.preventDefault();

    spinner.classList.remove("visually-hidden");
    dataCont.classList.add("visually-hidden");

    const response = await fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cityName: this.cityName.value,
      }),
    });

    const htmlText = await response.text();
    let parser = new DOMParser();
    let doc = parser.parseFromString(htmlText, "text/html");

    const mainContainer = document.getElementById("main-container");
    const docMainContainer = doc.getElementById("main-container");

    mainContainer.innerHTML = docMainContainer.innerHTML;

    //get DateTime of location
    getDateTime();
    //change bg
    setBackground();
    //convert unix time
    convertUnix(doc);
    //empty text input
    document.getElementById("cityName").value = "";
  } catch (error) {
    console.log(error);
  }

  spinner.classList.add("visually-hidden");
  dataCont.classList.remove("visually-hidden");
});

//change temp unit
function convertTemp() {
  const setUnit = document.getElementById("set-unit");

  if (setUnit) {
    //on click func works rather than evenlistener after getting location through lat and lon
    // setUnit.addEventListener("click", function () {
    const temp = document.getElementById("temp");
    const feelsLike = document.getElementById("feels-like");

    if (setUnit.checked) {
      temp.innerHTML = toF(temp.innerHTML) + " " + "°F";
      feelsLike.innerHTML =
        "Feels like " + toF(feelsLike.innerHTML) + " " + "°F";
    } else {
      temp.innerHTML = toC(temp.innerHTML) + " " + "°C";
      feelsLike.innerHTML =
        "Feels like " + toC(feelsLike.innerHTML) + " " + "°C";
    }
  }
}

function toC(num) {
  const reg = /-?\d+\.?\d*/g;
  const temp = Number(num.match(reg));
  return ((temp - 32) * (5 / 9)).toFixed(2);
}

function toF(num) {
  const reg = /-?\d+\.?\d*/g;
  const temp = Number(num.match(reg));
  return (temp * (9 / 5) + 32).toFixed(2);
}

function convertUnix(doc) {
  let reg = /\d+/g;
  let docSunrise = doc.getElementById("sunrise").innerHTML.match(reg);
  let docSunset = doc.getElementById("sunset").innerHTML.match(reg);
  let sunrise = document.getElementById("sunrise");
  let sunset = document.getElementById("sunset");

  sunrise.innerHTML =
    "Sunrise " +
    new Date(Number(...docSunrise) * 1000).toLocaleTimeString("en-us");
  sunset.innerHTML =
    "Sunset " +
    new Date(Number(...docSunset) * 1000).toLocaleTimeString("en-us");
}

function getDateTime() {
  const dateTime = document.getElementById("date-time");
  let date = new Date();
  let options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: dateTime.innerHTML,
  };
  dateTime.innerHTML = date.toLocaleString("en-us", options);
  return date.toLocaleString("en-us", options);
}

function setBackground() {
  const dateTime = document.getElementById("date-time");
  const date = new Date(dateTime.innerHTML);
  const hour = date.getHours();
  const mainStatus = document.getElementById("main")
    ? document.getElementById("main").innerHTML
    : "";
  if (hour >= 18 || hour < 5) {
    document
      .getElementById("bg-video")
      .setAttribute("src", "/videos/night.mp4");
  } else {
    document.getElementById("bg-video").setAttribute("src", "/videos/day.mp4");
  }
  if (
    mainStatus == "Rain" ||
    mainStatus == "Thunderstorm" ||
    mainStatus == "Snow"
  ) {
    document
      .getElementById("bg-video")
      .setAttribute("src", `/videos/${mainStatus.toLowerCase()}.mp4`);
  }
}
