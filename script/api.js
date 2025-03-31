const loctionName = document.querySelector(".loctionName")


//Get Weather
const getData = async (lat, lon) => {
    const meteUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weathercode,cloudcover,visibility,windspeed_180m,temperature_180m,is_day,freezinglevel_height&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_hours,precipitation_probability_max,windspeed_10m_max&current_weather=true&timezone=auto&forecast_days=14&models=best_match`;
    const url = await fetch(meteUrl);
    const data = await url.json();
    return data;
  };
  
  const getWeather = async (lat, lon) => {
    const data = await getData(lat, lon);
    loader.style.display = "none";  // Yuklashni to'xtatish
  
     // Eski animatsiyani tozalash
  
    // Yomg‘ir va qor animatsiyalarini chiqarish
 
    return data;
  };

//Location Api
const getLocation = (lat, lon) => {
    const locUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=uz`;
    fetch(locUrl)
      .then((res) => res.json())
      .then((data) => {
        loctionName.innerHTML = `<i class="fa fa-map-marker"></i> ${data.locality}`;
      })
      .catch(() => {
        loctionName.innerText = "Joylashuvni olib bo'lmadi";
      });
  };   
  //Location
  function Location() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos);
      function pos(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeather(lat, lon)
          .then((data) => updateLive(data))
          .catch(() => {
            alert("Ob havoni olib bo'lmadi");
          });
        getLocation(lat, lon);
      }
    }  else {
      alert("Joylashuvda xatolik");
    }
  }
    
  Location();