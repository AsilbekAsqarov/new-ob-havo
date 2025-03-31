function getCurrentHour() {
    return new Date().getHours();
}
const canvas = document.getElementById("weatherCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isDay = true;
const sun = document.querySelector(".sun");
const moon = document.querySelector(".moon");
const stars = document.querySelector(".stars");
//Kun va tun
function toggleTime(isDay) {
    if (isDay) {
        document.body.style.background = "linear-gradient(to bottom, #87CEEB, #ffffff)";
        sun.classList.remove("hidden");
        moon.classList.add("hidden");
        stars.classList.add("hidden");
    } else {
        document.body.style.background = "linear-gradient(to bottom, #1E3C72, #000000)";
        sun.classList.add("hidden");
        moon.classList.remove("hidden");
        stars.classList.remove("hidden");
    }
}
//Yulduzlar
function createStars() {
    for (let i = 0; i < 100; i++) {
        let star = document.createElement("div");
        star.classList.add("star");
        star.style.top = Math.random() * 100 + "%";
        star.style.left = Math.random() * 100 + "%";
        star.style.animationDuration = (Math.random() * 2 + 1) + "s";
        document.querySelector(".stars").appendChild(star);
    }
}
//Bulutlar
function cloud(){
    const clouds = [];

class Cloud {
    constructor(x, y, size, speed, opacity) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.opacity = opacity;
    }
    
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, Math.PI * 0.5, Math.PI * 1.5);
        ctx.arc(this.x + this.size, this.y - this.size, this.size, Math.PI * 1, Math.PI * 2);
        ctx.arc(this.x + this.size * 2, this.y, this.size, Math.PI * 1.5, Math.PI * 2.5);
        ctx.arc(this.x + this.size * 3, this.y - this.size, this.size, Math.PI * 1, Math.PI * 2);
        ctx.arc(this.x + this.size * 4, this.y, this.size, Math.PI * 1.5, Math.PI * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
    
    move() {
        this.x += this.speed;
        if (this.x - this.size * 5 > canvas.width) {
            this.x = -this.size * 5;
        }
    }
}

function createClouds(count) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.5;
        const size = Math.random() * 30 + 30;
        const speed = Math.random() * 0.5 + 0.2;
        const opacity = Math.random() * 0.5 + 0.3;
        clouds.push(new Cloud(x, y, size, speed, opacity));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clouds.forEach(cloud => {
        cloud.move();
        cloud.draw();
    });
    requestAnimationFrame(animate);
}

createClouds(10);
animate();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    clouds.length = 0;
    createClouds(10);
});

}

//Yomg'irli bulut
function rainCloud (){
    const clouds = [];
    const raindrops = [];
    
    class Cloud {
        constructor(x, y, size, speed, opacity) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speed = speed;
            this.opacity = opacity;
        }
        
        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = "rgba(50, 50, 50, 0.9)"; // Qorong'u kulrang bulutlar
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, Math.PI * 0.5, Math.PI * 1.5);
            ctx.arc(this.x + this.size, this.y - this.size, this.size, Math.PI * 1, Math.PI * 2);
            ctx.arc(this.x + this.size * 2, this.y, this.size, Math.PI * 1.5, Math.PI * 2.5);
            ctx.arc(this.x + this.size * 3, this.y - this.size, this.size, Math.PI * 1, Math.PI * 2);
            ctx.arc(this.x + this.size * 4, this.y, this.size, Math.PI * 1.5, Math.PI * 0.5);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }
        
        move() {
            this.x += this.speed;
            if (this.x - this.size * 5 > canvas.width) {
                this.x = -this.size * 5;
            }
        }
    }
    
    class Raindrop {
        constructor(x, y, length, speed) {
            this.x = x;
            this.y = y;
            this.length = length;
            this.speed = speed;
        }
        
        draw() {
            ctx.strokeStyle = "rgba(173, 216, 230, 0.7)"; // Yomg'ir tomchilarining rangi
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + 2, this.y + this.length);
            ctx.stroke();
        }
        
        move() {
            this.y += this.speed;
            if (this.y > canvas.height) {
                this.y = Math.random() * -20;
                this.x = Math.random() * canvas.width;
            }
        }
    }
    
    function createClouds(count) {
        for (let i = 0; i < count; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height * 0.5;
            const size = Math.random() * 30 + 30;
            const speed = Math.random() * 0.5 + 0.2;
            const opacity = Math.random() * 0.5 + 0.3;
            clouds.push(new Cloud(x, y, size, speed, opacity));
        }
    }
    
    function createRain(count) {
        for (let i = 0; i < count; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const length = Math.random() * 10 + 10;
            const speed = Math.random() * 2 + 2;
            raindrops.push(new Raindrop(x, y, length, speed));
        }
    }
    
    function drawRain() {
        raindrops.forEach(drop => {
            drop.move();
            drop.draw();
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        clouds.forEach(cloud => {
            cloud.move();
            cloud.draw();
        });
        drawRain(); // Yomg'ir animatsiyasini chizish
        requestAnimationFrame(animate);
    }
    
    createClouds(10);
    createRain(50);
    animate();
    
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        clouds.length = 0;
        raindrops.length = 0;
        createClouds(10);
        createRain(50);
    });
    
}
        // Yomg'ir yaratish
        function createRain() {
            let drops = [];
            for (let i = 0; i < 200; i++) {
                drops.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    speedY: Math.random() * 12 + 8,
                    length: Math.random() * 20 + 10,
                    opacity: Math.random() * 0.5 + 0.3,
                });
            }

            function animateRain() {
                document.body.style.background = "linear-gradient(to bottom, #1E3C72, #000000)";
                sun.classList.add("hidden");
                moon.classList.add("hidden");
                stars.classList.add("hidden");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = "rgba(173, 216, 230, 0.8)";
                ctx.lineWidth = 2;

                drops.forEach(drop => {
                    ctx.beginPath();
                    ctx.moveTo(drop.x, drop.y);
                    ctx.lineTo(drop.x, drop.y + drop.length);
                    ctx.stroke();
                    drop.y += drop.speedY;

                    if (drop.y > canvas.height) {
                        drop.y = 0;
                        drop.x = Math.random() * canvas.width;
                    }
                });

                requestAnimationFrame(animateRain);
            }

            animateRain();
        }
    
        // Qor: Sezilarli kattaroq va sekinroq
        function createSnow() {
            let flakes = [];
            for (let i = 0; i < 100; i++) {
                flakes.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    speedY: Math.random() * 1 + 0.5,
                    size: Math.random() * 5 + 5,
                });
            }

            function animateSnow() {
                document.body.style.background = "linear-gradient(to bottom, #1E3C72, #000000)";
                sun.classList.add("hidden");
                moon.classList.add("hidden");
                stars.classList.add("hidden");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "rgba(255, 255, 255, 0.8)";

                flakes.forEach(flake => {
                    ctx.beginPath();
                    ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
                    ctx.fill();
                    flake.y += flake.speedY;

                    if (flake.y > canvas.height) {
                        flake.y = 0;
                        flake.x = Math.random() * canvas.width;
                    }
                });

                requestAnimationFrame(animateSnow);
            }

            animateSnow();
        }

        // Ochiq havo: Har qanday animatsiyani to‘xtatish
        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        function updateSunProgress(sunriseTime, sunsetTime) {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes(); // Hozirgi vaqt (daqiqalarda)
        
            // Vaqtlarni daqiqalarga o‘girish
            const sunriseMinutes = parseInt(sunriseTime.split(":")[0]) * 60 + parseInt(sunriseTime.split(":")[1]);
            const sunsetMinutes = parseInt(sunsetTime.split(":")[0]) * 60 + parseInt(sunsetTime.split(":")[1]);
        
            let progress = 0;
        
            if (currentTime < sunriseMinutes) {
                progress = 0; // Quyosh hali chiqmagan
            } else if (currentTime > sunsetMinutes) {
                progress = 100; // Quyosh botgan
            } else {
                progress = ((currentTime - sunriseMinutes) / (sunsetMinutes - sunriseMinutes)) * 100;
            }
        
            document.getElementById("sunProgress").style.width = progress + "%";
            // console.log(`Sun Progress: ${progress.toFixed(2)}%`);
        }
        
        

// Har 1 soatda yangilash
setInterval(updateSunProgress, 3600000); 
 // Dastlab ishga tushirish

function showWeather(type, button) {
    // Hamma ob-havo bo'limlarini o‘chirib, faqat bittasini ko‘rsatish
    document.querySelectorAll('.weather-info').forEach(info => info.classList.remove('active'));
    document.getElementById(type).classList.add('active');

    // Tugmalarning active klassini yangilash
    document.querySelectorAll('.button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

// Sahifa yuklanganda harakatlanish funksiyasini ishga tushirish
document.addEventListener("DOMContentLoaded", function () {
    const weatherLists = document.querySelectorAll(".weather-list");

    weatherLists.forEach(weatherList => {
        let isDragging = false;
        let startX, startScrollLeft;

        // Drag (sichqoncha bilan surish) funksiyasi
        function startDrag(e) {
            isDragging = true;
            startX = e.clientX || e.touches[0].clientX;
            startScrollLeft = weatherList.scrollLeft;
            weatherList.style.cursor = "grabbing";
            e.preventDefault();
        }

        function doDrag(e) {
            if (!isDragging) return;
            const x = e.clientX || e.touches[0].clientX;
            const scrollSpeed = 2;
            weatherList.scrollLeft = startScrollLeft - (x - startX) * scrollSpeed;
        }

        function stopDrag() {
            isDragging = false;
            weatherList.style.cursor = "grab";
        }

        // Sichqoncha hodisalari
        weatherList.addEventListener("mousedown", startDrag);
        weatherList.addEventListener("mousemove", doDrag);
        weatherList.addEventListener("mouseup", stopDrag);
        weatherList.addEventListener("mouseleave", stopDrag);

        // Sensorli ekranlar uchun touch hodisalari
        weatherList.addEventListener("touchstart", startDrag);
        weatherList.addEventListener("touchmove", doDrag);
        weatherList.addEventListener("touchend", stopDrag);
    });
});



