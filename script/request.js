const temp = document.querySelector(".temp")
const maxMin = document.querySelector(".maxMin")
const weatherName = document.querySelector(".weatherName")
const sunset = document.getElementById("sunset");
const sunrise = document.getElementById("sunrise")
const feeling = document.getElementById("feeling")
const humidity = document.getElementById("humidity")
const windSpeed = document.getElementById("windSpeed")
const precip = document.getElementById("precip")
const visibility = document.getElementById("visibility")
const cloudDensity = document.getElementById("cloudDensity")
let morningBlock = document.getElementById("morningIcon");
let dayBlock = document.getElementById("dayIcon");
let eveningBlock = document.getElementById("eveningIcon");
let nightBlock = document.getElementById("nightIcon");
let morningTemp = document.getElementById("morningTemp");
let dayTemp = document.getElementById("dayTemp");
let eveningTemp = document.getElementById("eveningTemp");
let nightTemp = document.getElementById("nightTemp");
let morningPecip  = document.getElementById("morningPecip");
let dayPecip  = document.getElementById("dayPecip");
let eveningPecip  = document.getElementById("eveningPecip");
let nightPecip  = document.getElementById("nightPecip");

 const updateLive = (data) => {
    const sunrise1 = data.daily.sunrise[0].slice(11)
    const sunset1 = data.daily.sunset[0].slice(11)
    sunrise.innerHTML = sunrise1;
    sunset.innerHTML = sunset1;
    updateSunProgress(sunrise1, sunset1); 
      if(data.current_weather.is_day == 0){
        toggleTime(0)
    }else{
        toggleTime(1)
    }
    temp.innerHTML = `${Math.round(data.current_weather.temperature)}°`;
    if (data.daily.temperature_2m_min[0] == data.daily.temperature_2m_max[0]) {
   maxMin.innerHTML = `${Math.floor(data.daily.temperature_2m_min[0])}°`;
    } else {
      maxMin.innerHTML = `${Math.floor(
        data.daily.temperature_2m_min[0]
      )}°/${Math.floor(data.daily.temperature_2m_max[0])}°`;
    }
    if(data.current_weather.weathercode == 0 && data.current_weather.is_day == 0){
      createStars();
   }else if(data.current_weather.weathercode == 1 && data.current_weather.is_day == 0 ){
       createStars();
    }


    if(data.current_weather.weathercode == 0 || data.current_weather.weathercode == 1){
      weatherName.innerHTML = "Ochiq havo";
     
    }else if(data.current_weather.weathercode == 2 || data.current_weather.weathercode == 3){
      weatherName.innerHTML = "Bulutli";
      cloud()
    } else if(data.current_weather.weathercode == 45  || data.current_weather.weathercode == 48){
      weatherName.innerHTML = "Tuman";
    }else if(data.current_weather.weathercode == 51 || 
             data.current_weather.weathercode == 53 || 
             data.current_weather.weathercode == 55 ||
             data.current_weather.weathercode == 56 ||
             data.current_weather.weathercode == 57){
      weatherName.innerHTML = "Yengil yomg'ir";
      rainCloud ()
    }else if(data.current_weather.weathercode == 61 ||
             data.current_weather.weathercode == 63 ||
             data.current_weather.weathercode == 65 ||
             data.current_weather.weathercode == 67 ||
             data.current_weather.weathercode == 80 ||
             data.current_weather.weathercode == 81 ||
             data.current_weather.weathercode == 82){
      weatherName.innerHTML = "Yomg'ir";
      createRain();
   } else if(data.current_weather.weathercode == 71 ||
             data.current_weather.weathercode == 73 ||
             data.current_weather.weathercode == 75 ||
             data.current_weather.weathercode == 77 ||
             data.current_weather.weathercode == 80 ||
             data.current_weather.weathercode == 81 ||
             data.current_weather.weathercode == 82 ||
             data.current_weather.weathercode == 85 ||
             data.current_weather.weathercode == 86 ){ 
         weatherName.innerHTML = "Qor";
         createSnow()
   } else if(data.current_weather.weathercode == 95 ||
             data.current_weather.weathercode == 96 ||
             data.current_weather.weathercode == 99){
               weatherName.innerHTML = "Momaqaldiroq";
            }else{
                weatherName.innerHTML = "...";

             }
   //Ummiy blok
   feeling.innerHTML = `${Math.round(data.daily.apparent_temperature_max[0])}°`
   humidity.innerHTML = `${data.hourly.relativehumidity_2m[0]}%`
   windSpeed.innerHTML = `${data.current_weather.windspeed} km/s`
   if (data.hourly.cloudcover[0] === 0) {
    cloudDensity.innerHTML = "Bulutsiz";
  } else {
    cloudDensity.innerHTML = `${data.hourly.cloudcover[0]}%`;
  }
   if (data.daily.precipitation_probability_max[0] === 0) {
    precip.innerHTML = `Yo'q`;
  } else {
    precip.innerHTML = `${data.daily.precipitation_probability_max[0]}%`;
  }
  if (data.hourly.visibility[0] >= 1000) {
    visibility.innerHTML = "Cheksiz";
  } else {
    visibility.innerHTML = `${Math.round(data.hourly.visibility[0])} m`;
  }

//Kun davomida
function setWeatherIcons() {
  let code = data.hourly.weathercode[8];
  let weatherIcons = {
      clear: "☀️",
      clearNight: "🌙", 
      partlyCloudy: "⛅",
      partlyCloudyNight: "🌙☁️",
      cloudy: "☁️",
      fog: "🌫️",
      rain: "🌧️",
      snow: "❄️",
      thunder: "⛈️"
  };

  let weatherType = "";

  if (code == 0 || code == 1) {
      weatherType = "clear";
  } else if (code == 2 || code == 3) {
      weatherType = "partlyCloudy";
  } else if (code == 45 || code == 48) {
      weatherType = "fog";
  } else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
      weatherType = "rain";
  } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
      weatherType = "snow";
  } else if ([95, 96, 99].includes(code)) {
      weatherType = "thunder";
  } else {
      weatherType = "cloudy";
  }
  morningBlock.innerHTML = weatherIcons[weatherType];
  dayBlock.innerHTML = weatherIcons[weatherType];
  eveningBlock.innerHTML = weatherIcons[weatherType];
  
  if (weatherType === "clear") {
      nightBlock.innerHTML = weatherIcons["clearNight"];
  } else if (weatherType === "partlyCloudy") {
      nightBlock.innerHTML = weatherIcons["partlyCloudyNight"];
  } else {
      nightBlock.innerHTML = weatherIcons[weatherType];
  }
}

// Funksiyani chaqirish
setWeatherIcons();

morningTemp.innerHTML = `${Math.round(data.hourly.apparent_temperature[8])}°`;
dayTemp.innerHTML =  `${Math.round(data.hourly.apparent_temperature[13])}°`;
eveningTemp.innerHTML =  `${Math.round(data.hourly.apparent_temperature[18])}°`;
nightTemp.innerHTML =  `${Math.round(data.hourly.apparent_temperature[22])}°`;
morningPecip.innerHTML = `💧 ${data.hourly.precipitation_probability[8]}%`;
dayPecip.innerHTML = `💧 ${data.hourly.precipitation_probability[13]}%`;
eveningPecip.innerHTML = `💧 ${data.hourly.precipitation_probability[18]}%`;
nightPecip.innerHTML = `💧 ${data.hourly.precipitation_probability[22]}%`; 

//Soat davomida
function getNext12HoursWeather(data) {
  let now = new Date(); // Joriy vaqtni olish
  // Kelajakdagi 12 soatni olish
  let next12Hours = data.time
      .map((time, i) => ({
          time: time,
          weatherCode: data.weathercode[i],
          temperature: data.temperature_2m[i],
          probability: data.precipitation_probability[i] // Yomg'ir ehtimoli (agar mavjud bo'lsa)
      }))
      .filter(entry => {
          let entryTime = new Date(entry.time); // Vaqtni tahlil qilamiz
          return entryTime >= now; // Faqat kelajakdagi vaqtni qoldiramiz
      })
      .slice(0, 12); // Kelasi 12 soatni olish

  if (next12Hours.length === 0) {
      console.log("❌ Kelajakdagi ob-havo ma'lumotlari topilmadi.");
  }

  return next12Hours;
}

// 📌 Funksiyani chaqirish va konsolda tekshirish
let nextWeather = getNext12HoursWeather(data.hourly);

// 📌 Konsolda natijani chiqarish
nextWeather.forEach(entry => {
  let time = new Date(entry.time);
  let hours = time.getHours(); // Soatni olish
  let temperature = entry.temperature;
  let weatherCode = entry.weatherCode;
  let probability = entry.probability; // Yomg'ir ehtimoli
  let weatherIcon = ""; // Smaylni belgilash
 // Ob-havo smayllari
 let weatherIcons = {
  clear: "☀️",            // Kunduzi quyosh
  clearNight: "🌙",       // Tunlarda oy
  partlyCloudy: "⛅",     // Qisman bulutli
  partlyCloudyNight: "🌙☁️",  // Qisman bulutli tun
  cloudy: "☁️",           // Bulutli
  fog: "🌫️",              // Tuman
  rain: "🌧️",             // Yomg'ir
  snow: "❄️",             // Qor
  thunder: "⛈️"           // Yomg'ir va chaqmoq
};
  // Smayllarni soatga qarab belgilash
  if (hours >= 6 && hours < 18) { // Kunduzi soat 6 dan 18 gacha
      if (weatherCode == 0 || weatherCode == 1) {
          weatherIcon = weatherIcons.clear; // Ochik havo
      } else if (weatherCode == 2 || weatherCode == 3) {
          weatherIcon = weatherIcons.partlyCloudy; // Qisman bulutli
      } else if (weatherCode == 45 || weatherCode == 48) {
          weatherIcon = weatherIcons.fog; // Tuman
      } else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
          weatherIcon = weatherIcons.rain; // Yomg'ir
      } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
          weatherIcon = weatherIcons.snow; // Qor
      } else if ([95, 96, 99].includes(weatherCode)) {
          weatherIcon = weatherIcons.thunder; // Yomg'ir va chaqmoq
      } else {
          weatherIcon = weatherIcons.cloudy; // Bulutli
      }
  } else { // Tun soat 18 dan 6 gacha
      if (weatherCode == 0 || weatherCode == 1) {
          weatherIcon = weatherIcons.clearNight; // Tunlarda oy
      } else if (weatherCode == 2 || weatherCode == 3) {
          weatherIcon = weatherIcons.partlyCloudyNight; // Qisman bulutli tun
      } else if (weatherCode == 45 || weatherCode == 48) {
          weatherIcon = weatherIcons.fog; // Tuman
      } else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
          weatherIcon = weatherIcons.rain; // Yomg'ir
      } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
          weatherIcon = weatherIcons.snow; // Qor
      } else if ([95, 96, 99].includes(weatherCode)) {
          weatherIcon = weatherIcons.thunder; // Yomg'ir va chaqmoq
      } else {
          weatherIcon = weatherIcons.cloudy; // Bulutli
      }
  }

  // Konsolda ob-havo smayllari bilan natijani chiqarish
  let container = document.createElement("div"); 
container.classList.add("weather-box");

// Ichki elementlar
let timeTime = document.createElement("span");
timeTime.textContent = `${hours}:00`;

let timeIcon = document.createElement("span");
timeIcon.textContent = weatherIcon; // Quyosh smayli

let timeTemp = document.createElement("span");
timeTemp.textContent = `${Math.round(temperature)}°C`;

let timeProbability = document.createElement('span');
timeProbability.textContent = `💧 ${probability}%`;

// Hammasini div ichiga joylash
container.appendChild(timeTime);
container.appendChild(timeIcon);
container.appendChild(timeTemp);
container.appendChild(timeProbability);

// Sahifaga qo‘shish
const t = document.getElementById("hourlyList")
t.appendChild(container);
});
//Kunlardavomida
const weekDays = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];
// Faqat 7 kunni ko'rsatish uchun cheklash
const numOfDays = 8;

data.daily.time.slice(1, numOfDays).forEach((dateStr, i) => {
    let date = new Date(dateStr);
    let day = String(date.getDate()).padStart(2, '0'); // Kun (01-31)
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Oy (01-12)
    let weekDay = weekDays[date.getDay()]; // Haftaning kuni

    let weatherCode = data.daily.weathercode[i];
    let minTemp = data.daily.temperature_2m_min[i];
    let maxTemp = data.daily.temperature_2m_max[i];
    let precipitation = data.daily.precipitation_probability_max[i];

    let weatherIcons = {
        clear: "☀️",
        partlyCloudy: "⛅",
        cloudy: "☁️",
        fog: "🌫️",
        rain: "🌧️",
        snow: "❄️",
        thunder: "⛈️"
    };

    let weatherType = "cloudy"; // Default qiymat
    if ([0, 1].includes(weatherCode)) weatherType = "clear";
    else if ([2, 3].includes(weatherCode)) weatherType = "partlyCloudy";
    else if ([45, 48].includes(weatherCode)) weatherType = "fog";
    else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) weatherType = "rain";
    else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) weatherType = "snow";
    else if ([95, 96, 99].includes(weatherCode)) weatherType = "thunder";


    // Div yaratish
    let container1 = document.createElement("div"); 
    container1.classList.add("weather-item");

    // Ichki elementlar
    let daysTime = document.createElement("span");
    daysTime.textContent = `${day}/${month} ${weekDay}`;

    let daysIcon = document.createElement("span");
    daysIcon.textContent = weatherIcons[weatherType];

    let daysTemp = document.createElement("span");
    daysTemp.textContent = `${Math.round(minTemp)}°/${Math.round(maxTemp)}°`;
    let daysPrecipitation = document.createElement("span");
    daysPrecipitation.textContent = `💧 ${precipitation}%`


    // Barcha elementlarni qo‘shish
    container1.appendChild(daysTime);
    container1.appendChild(daysPrecipitation)
    container1.appendChild(daysIcon);
    container1.appendChild(daysTemp);
  

    // HTML ga qo‘shish
    let t = document.getElementById("daysDiv");
    if (t) {
        t.appendChild(container1);
    } else {
        console.error("Element with id 'days' not found!");
    }
});


 }

 
