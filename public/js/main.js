//change bg based on time of the day
document.addEventListener("DOMContentLoaded", function (event) {
  const date = new Date();
  const hour = date.getHours();

  if (hour >= 18) {
    document.querySelector("html").classList.add("night");
  } else {
    document.querySelector("html").classList.remove("night");
  }
});

//get location
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
      const data = { lat, lon, locatorClicked: true };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      };

      //sending and getting data to server
      try {
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
        const dataCont = doc.getElementById("data-cont");
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

        console.log("date time", dateTime);
        //chnage bg
      } catch (error) {
        console.log("something went wrong while retrieving response", error);
      }
    });
  } else {
    console.log("unable to get location");
  }
});

//change temp unit
function convertTemp() {
  const setUnit = document.getElementById("set-unit");

  if (setUnit) {
    //on click func works rather than evenlistener after getting location through lat and lon
    // setUnit.addEventListener("click", function () {
    const temp = document.getElementById("temp");
    const feelsLike = document.getElementById("feels-like");

    const cityNameText = document.getElementById("location").innerHTML;
    const comma = cityNameText.indexOf(",");
    const cityName = cityNameText.slice(0, comma);
    const requestedUnit = setUnit.checked;
    console.log("unit", requestedUnit);

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
