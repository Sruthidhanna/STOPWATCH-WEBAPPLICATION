let startTime = 0;
let elapsedTime = 0;
let intervalId;
let isRunning = false;

const display = document.getElementById("display");
const laps = document.getElementById("laps");
const startBtn = document.getElementById("startBtn");
const clickSound = document.getElementById("clickSound");

window.onload = () => {
  loadLaps();
  applySavedTheme();
};

function formatTime(ms) {
  const date = new Date(ms);
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
  return `${minutes}:${seconds}.${milliseconds}`;
}

function updateDisplay() {
  const time = Date.now() - startTime + elapsedTime;
  display.textContent = formatTime(time);
}

function toggleStartPause() {
  clickSound.play();
  if (!isRunning) {
    startTime = Date.now();
    intervalId = setInterval(updateDisplay, 10);
    isRunning = true;
    startBtn.textContent = "Pause";
  } else {
    clearInterval(intervalId);
    elapsedTime += Date.now() - startTime;
    isRunning = false;
    startBtn.textContent = "Start";
  }
}

function resetStopwatch() {
  clickSound.play();
  clearInterval(intervalId);
  startTime = 0;
  elapsedTime = 0;
  isRunning = false;
  display.textContent = "00:00:00.000";
  laps.innerHTML = "";
  localStorage.removeItem("lapTimes");
  startBtn.textContent = "Start";
}

function recordLap() {
  if (!isRunning) return;
  clickSound.play();
  const time = Date.now() - startTime + elapsedTime;
  const formatted = formatTime(time);
  const li = document.createElement("li");
  li.textContent = `Lap: ${formatted}`;
  laps.appendChild(li);
  saveLap(formatted);
}

function saveLap(lapTime) {
  const savedLaps = JSON.parse(localStorage.getItem("lapTimes")) || [];
  savedLaps.push(lapTime);
  localStorage.setItem("lapTimes", JSON.stringify(savedLaps));
}

function loadLaps() {
  const savedLaps = JSON.parse(localStorage.getItem("lapTimes")) || [];
  savedLaps.forEach(time => {
    const li = document.createElement("li");
    li.textContent = `Lap: ${time}`;
    laps.appendChild(li);
  });
}

function toggleTheme() {
  clickSound.play();
  document.body.classList.toggle("dark");
  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
}
