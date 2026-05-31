// CLOCK
function updateClock() {
  let now = new Date();
  let time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  document.getElementById("clock").innerText = time;
}
setInterval(updateClock, 1000);
updateClock();

// SEARCH
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  let query = document.getElementById("searchInput").value;
  window.location.href = "https://www.google.com/search?q=" + encodeURIComponent(query);
});

// SETTINGS TOGGLE
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
settingsBtn.onclick = () => {
  settingsPanel.classList.toggle("show");
  themePanel.classList.remove("show");
};

// THEME TOGGLE
const themeBtn = document.getElementById("themeBtn");
const themePanel = document.getElementById("themePanel");
const themeList = document.getElementById("themeList");
const applyThemeBtn = document.getElementById("applyThemeBtn");

let currentTheme = "ocean";
let selectedTheme = "ocean";

themeBtn.onclick = () => {
  themePanel.classList.toggle("show");
  settingsPanel.classList.remove("show");
};

function renderThemeList() {
  themeList.innerHTML = "";

  (window.themeRegistry || []).forEach((theme) => {
    let button = document.createElement("button");
    button.type = "button";
    button.className = "theme-option";
    button.dataset.theme = theme.id;

    let preview = document.createElement("span");
    preview.className = "theme-preview";

    let previewImage = document.createElement("img");
    previewImage.src = theme.previewImage || "assets/theme_logo.svg";
    previewImage.alt = theme.name + " preview";
    previewImage.onerror = () => {
      previewImage.src = "assets/theme_logo.svg";
    };
    preview.appendChild(previewImage);

    let name = document.createElement("span");
    name.className = "theme-name";
    name.innerText = theme.name;

    button.appendChild(preview);
    button.appendChild(name);

    button.addEventListener("click", () => {
      selectedTheme = theme.id;
      updateSelectedTheme();
    });

    themeList.appendChild(button);
  });

  updateSelectedTheme();
}

function updateSelectedTheme() {
  document.querySelectorAll(".theme-option").forEach((button) => {
    button.classList.toggle("selected", button.dataset.theme === selectedTheme);
  });
}

applyThemeBtn.addEventListener("click", () => {
  currentTheme = selectedTheme;
  saveSettings();
  themePanel.classList.remove("show");
  window.dispatchEvent(new Event("themeChanged"));
});

// LOAD SETTINGS
function loadSettings() {
  let settings = JSON.parse(localStorage.getItem("gridSettings")) || {};

  document.getElementById("spacing").value = settings.spacing || 20;
  document.getElementById("speed").value = settings.speed || 0.12;

  currentTheme = settings.theme || "ocean";
  selectedTheme = currentTheme;
  updateSelectedTheme();

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

document.getElementById("saveSettingsBtn").onclick = () => {
  saveSettings();

  let saveButton = document.getElementById("saveSettingsBtn");
  saveButton.innerText = "Saved";

  setTimeout(() => {
    saveButton.innerText = "Save";
  }, 1200);
};

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
  selectedTheme = defaultSettings.theme;
  updateSelectedTheme();

  window.dispatchEvent(new Event("settingsChanged"));
  window.dispatchEvent(new Event("themeChanged"));
};

renderThemeList();
loadSettings();
