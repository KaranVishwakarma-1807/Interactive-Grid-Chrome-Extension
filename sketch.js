let activeTheme = null;
let activeThemeId = "";
let sketchSettings = {};

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("themeCanvas");

  applyActiveTheme();

  window.addEventListener("settingsChanged", () => {
    sketchSettings = getGridSettings();
  });

  window.addEventListener("themeChanged", () => {
    applyActiveTheme();
  });
}

function draw() {
  if (!activeTheme || !activeTheme.draw) {
    background(0);
    return;
  }

  sketchSettings = getGridSettings();
  activeTheme.draw(window, sketchSettings);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (activeTheme && activeTheme.windowResized) {
    activeTheme.windowResized(window, sketchSettings);
  }
}

function mousePressed() {
  if (activeTheme && activeTheme.mousePressed) {
    activeTheme.mousePressed(window, sketchSettings);
  }
}

function applyActiveTheme() {
  sketchSettings = getGridSettings();
  activeThemeId = sketchSettings.theme || "ocean";

  const theme = getThemeById(activeThemeId) || getThemeById("ocean");
  if (!theme) {
    return;
  }

  activeTheme = theme.create();

  if (activeTheme.setup) {
    activeTheme.setup(window, sketchSettings);
  }
}

function getThemeById(themeId) {
  return (window.themeRegistry || []).find(theme => theme.id === themeId);
}

function getGridSettings() {
  return JSON.parse(localStorage.getItem("gridSettings")) || {};
}
