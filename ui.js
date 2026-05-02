// CLOCK
function updateClock() {
  let now = new Date();
  let time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  document.getElementById("clock").innerText = time;
}
setInterval(updateClock, 1000);
updateClock();

// SEARCH
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  let query = document.getElementById("searchInput").value;
  window.location.href = "https://www.google.com/search?q=" + query;
});

// SETTINGS TOGGLE
const btn = document.getElementById("settingsBtn");
const panel = document.getElementById("settingsPanel");
btn.onclick = () => panel.classList.toggle("show");

// CUSTOM DROPDOWN LOGIC
const themeSelect = document.getElementById("themeSelect");
const themeOptions = document.getElementById("themeOptions");
const selectedText = document.getElementById("selectedThemeText");
const optionsList = document.querySelectorAll(".custom-option");

let currentTheme = "ocean";

themeSelect.addEventListener("click", (e) => {
  themeOptions.classList.toggle("show");
  themeSelect.classList.toggle("open");
  e.stopPropagation();
});

optionsList.forEach(opt => {
  opt.addEventListener("click", () => {
    currentTheme = opt.getAttribute("data-value");
    selectedText.innerText = opt.innerText;
    themeOptions.classList.remove("show");
    themeSelect.classList.remove("open");
    saveSettings();
  });
});

// Close dropdown if clicked outside
window.addEventListener("click", () => {
  themeOptions.classList.remove("show");
  themeSelect.classList.remove("open");
});

// LOAD SETTINGS
function loadSettings() {
  let settings = JSON.parse(localStorage.getItem("gridSettings")) || {};
  
  document.getElementById("spacing").value = settings.spacing || 20;
  document.getElementById("speed").value = settings.speed || 0.12;
  
  currentTheme = settings.theme || "ocean";
  selectedText.innerText = currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1);

  return settings;
}

// SAVE SETTINGS
function saveSettings() {
  let settings = {
    spacing: parseInt(document.getElementById("spacing").value),
    speed: parseFloat(document.getElementById("speed").value),
    theme: currentTheme
  };

  localStorage.setItem("gridSettings", JSON.stringify(settings));
  window.dispatchEvent(new Event("settingsChanged"));
}

// Listen for slider changes
document.querySelectorAll("#settingsPanel input").forEach(el => {
  el.addEventListener("input", saveSettings);
});

// RESET SETTINGS
document.getElementById("resetBtn").onclick = () => {
  let defaultSettings = { spacing: 20, speed: 0.12, theme: "ocean" };
  localStorage.setItem("gridSettings", JSON.stringify(defaultSettings));

  document.getElementById("spacing").value = defaultSettings.spacing;
  document.getElementById("speed").value = defaultSettings.speed;
  currentTheme = defaultSettings.theme;
  selectedText.innerText = "Ocean";

  window.dispatchEvent(new Event("settingsChanged"));
};

// Initial Load
loadSettings();
