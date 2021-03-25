const lat = "";
const long = "";

$("#click-me").on("click", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      long = position.coords.longitude;

      const coordinates = {lat, long}
      
    });
  }
  else{
      console.log("unable to get location")
  }
});

