const latestTime = document.getElementById("earthquakeTime");
const latestLocation = document.getElementById("earthquakeLocation");
const latestMag = document.getElementById("earthquakeMag");
const latestDepthDiv = document.getElementById("earthquakeDepth");
const expectedLocationText = document.getElementById("expectedLocation");
const expectedMag = document.getElementById("expectedMag");

let mapContainer = document.getElementById("mapZilzila");
let mapZilzila;
let latestMarkers = [];
let expectedMarker = null;
let earthquakeData = null;
let expectedLocation = null;

document.addEventListener("DOMContentLoaded", function () {
    fetchEarthquakeData(); // 🌍 Ma’lumotlarni oldindan yuklaymiz
    setInterval(fetchEarthquakeData, 60000);

    const zilzilaBtn = document.getElementById("zilzilaBtn");
    let mapVisible = false;

    zilzilaBtn.addEventListener("click", function () {
        mapVisible = !mapVisible;

        if (mapVisible) {
            mapContainer.style.height = "400px";
            mapContainer.style.visibility = "visible";
            mapContainer.style.opacity = "1";

            setTimeout(() => {
                if (!mapZilzila) {
                    initializeMap();
                } else {
                    mapZilzila.invalidateSize();
                    showEarthquakes(earthquakeData);
                }
            }, 300);

            zilzilaBtn.innerText = "❌ Zilzila xaritasini yashirish";
        } else {
            mapContainer.style.opacity = "0";
            setTimeout(() => {
                mapContainer.style.height = "0";
                mapContainer.style.visibility = "hidden";
            }, 500);
            zilzilaBtn.innerText = "🗺 Zilzila xaritasini ko‘rsatish";
        }
    });
});
function getLocationMap(lat, lon) {
    let geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.display_name) {
                expectedLocationText.innerText = data.display_name; // Joy nomini chiqarish
            } else {
                console.warn("Joy nomi topilmadi");
            }
        })
        .catch(error => {
            console.error("Joy nomini olishda xatolik:", error);
        });
}
function fetchEarthquakeData() {
    let apiUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${new Date().toISOString().split('T')[0]}&limit=50&orderby=time`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.features.length === 0) {
                console.warn("Zilzilalar topilmadi");
                return;
            }
            earthquakeData = data.features;
            updateLatestEarthquake(data.features);
            expectedLocation = findMostFrequentLocation(data.features);
            if (expectedLocation) {
                expectedLocationText.innerText = `Lat: ${expectedLocation.lat}, Lon: ${expectedLocation.lon}`;
                expectedMag.innerText = (data.features.reduce((sum, eq) => sum + eq.properties.mag, 0) / data.features.length).toFixed(2);
                getLocationMap(expectedLocation.lat, expectedLocation.lon)
            } else {
                expectedLocationText.innerText = "Aniqlanmagan";
                expectedMag.innerText = "Aniqlanmagan";
            }

            if (mapZilzila) {
                showEarthquakes(earthquakeData);
            }
        })
        .catch(error => {
            console.error("Xatolik yuz berdi:", error);
            latestLocation.innerText = "Ma'lumot olishda xatolik!";
        });
}

function initializeMap() {
    mapZilzila = L.map('mapZilzila').setView([40, 65], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapZilzila);

    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
        let grades = [0, 3, 4, 5, 6];
        let colors = ["green", "yellow", "orange", "red", "black"];
        let labels = ["Kuchsiz (M<3)", "Yengil (M3-4)", "O‘rta (M4-5)", "Katta (M5-6)", "Juda kuchli (M6+)"];

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML += `<i style="background:${colors[i]}"></i> ${labels[i]}<br>`;
        }

        div.innerHTML += `<i style="background:blue"></i> Kutilayotgan zilzila joyi<br>`;

        return div;
    };
    legend.addTo(mapZilzila);

    showEarthquakes(earthquakeData);
}

function showEarthquakes(earthquakes) {
    if (!mapZilzila || !earthquakes) return;

    latestMarkers.forEach(marker => mapZilzila.removeLayer(marker));
    latestMarkers = [];

    let bounds = L.latLngBounds();

    earthquakes.forEach(earthquake => {
        let lat = earthquake.geometry.coordinates[1];
        let lon = earthquake.geometry.coordinates[0];
        let magnitude = earthquake.properties.mag;
        let place = earthquake.properties.place;
        let time = new Date(earthquake.properties.time).toLocaleString();
        let depth = earthquake.geometry.coordinates[2];
        let formattedDepth = depth % 1 === 0 ? depth : depth.toFixed(2);

        bounds.extend([lat, lon]);

        let color = getColorByMagnitude(magnitude);
        let marker = L.circleMarker([lat, lon], {
            radius: magnitude * 2,
            fillColor: color,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(`
            <b>📍${place}</b><br>
            💥Magnituda: ${magnitude}<br>
            📏Chuqurlik: ${formattedDepth} km<br>
            🕒Vaqt: ${time}
        `);

        latestMarkers.push(marker);
        marker.addTo(mapZilzila);
    });

    if (expectedLocation) {
        if (expectedMarker) mapZilzila.removeLayer(expectedMarker);
        expectedMarker = L.circleMarker([expectedLocation.lat, expectedLocation.lon], {
            radius: 10,
            fillColor: "blue",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup("<b>Kutilayotgan zilzila joyi</b>");
        expectedMarker.addTo(mapZilzila);
    }

    mapZilzila.fitBounds(bounds);
}

function updateLatestEarthquake(earthquakes) {
    let latest = earthquakes[0];
    let time = new Date(latest.properties.time).toLocaleString();
    let place = latest.properties.place;
    let magnitude = latest.properties.mag;
    let latestDepth = latest.geometry.coordinates[2];
    let formattedDepth1 = latestDepth % 1 === 0 ? latestDepth : latestDepth.toFixed(2);

    latestTime.innerText = time;
    latestLocation.innerText = place;
    latestMag.innerText = magnitude;
    latestDepthDiv.innerText =  `${formattedDepth1} km`;
}

function getColorByMagnitude(magnitude) {
    if (magnitude >= 6) return "black";
    if (magnitude >= 5) return "red";
    if (magnitude >= 4) return "orange";
    if (magnitude >= 3) return "yellow";
    return "green";
}

function findMostFrequentLocation(earthquakes) {
    let counts = {};
    earthquakes.forEach(eq => {
        let lat = eq.geometry.coordinates[1].toFixed(2);
        let lon = eq.geometry.coordinates[0].toFixed(2);
        let key = `${lat},${lon}`;
        counts[key] = (counts[key] || 0) + 1;
    });

    let mostFrequent = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, null);
    if (!mostFrequent) return null;

    let [lat, lon] = mostFrequent.split(',').map(Number);
    return { lat, lon };
}
