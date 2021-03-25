$("#locate-me").on("click", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;

      $("#coords").text(`latitude: ${lat} longitude: ${long}`);
      const data = { latitude: lat, longitude: long };

      console.log("success " + JSON.stringify(data));

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
      fetch('/locate', options)
    });
  } else {
    console.log("unable to get location");
  }
});
