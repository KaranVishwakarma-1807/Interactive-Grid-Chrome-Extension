let cols, rows;
let spacing = 10;
let size = [];

let bgColor;
let settings = {};

let lastSpacing = spacing;

// ripple
let ripple = null;

// flash effect
let flashAlpha = 0;

// smooth mouse
let smoothX = 0;
let smoothY = 0;
let mouseInfluence = 1; // controls blending

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  noStroke();

  bgColor = color(10, 25, 30);

  settings = JSON.parse(localStorage.getItem("gridSettings")) || {};
  spacing = settings.spacing || 20;

  cols = ceil(width / spacing);
  rows = ceil(height / spacing);

  for (let i = 0; i < cols; i++) {
    size[i] = [];
    for (let j = 0; j < rows; j++) {
      size[i][j] = 0;
    }
  }

  window.addEventListener("settingsChanged", () => {
    settings = JSON.parse(localStorage.getItem("gridSettings")) || {};

    spacing = settings.spacing || 20;

    // rebuild grid
    cols = ceil(width / spacing);
    rows = ceil(height / spacing);

    size = [];
    for (let i = 0; i < cols; i++) {
      size[i] = [];
      for (let j = 0; j < rows; j++) {
        size[i][j] = 0;
      }
    }
  });
}

function draw() {

  loadSettings(); // load settings each frame to reflect changes immediately

  // background
  let targetBg = color(
    map(mouseX, 0, width, 50, 150),
    map(mouseY, 0, height, 50, 150),
    map(mouseX + mouseY, 0, width + height, 80, 180)
  );

  bgColor = lerpColor(bgColor, targetBg, 0.05);
  background(bgColor);

  // smooth mouse
  smoothX = lerp(smoothX, mouseX, 0.2);
  smoothY = lerp(smoothY, mouseY, 0.2);

  let maxDist = 125;
  let maxSize = spacing;

  // smooth mouse influence fade
  if (ripple) {
    mouseInfluence = lerp(mouseInfluence, 0, 0.08);
  } else {
    mouseInfluence = lerp(mouseInfluence, 1, 0.05);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {

      let x = spacing / 2 + i * spacing;
      let y = spacing / 2 + j * spacing;

      // base mouse effect
      let d = dist(smoothX, smoothY, x, y);
      let baseSize = map(d, 0, maxDist, 2, maxSize);

      let rippleSize = baseSize;

      // ripples
      if (ripple) {
        let rd = dist(x, y, ripple.x, ripple.y);

        let waveWidth = 25;
        let diff = abs(rd - ripple.radius);

        let wave = exp(-pow(diff / waveWidth, 2));

        // fade tail behind wave
        let tail = exp(-rd * 0.002);

        rippleSize = map(wave * tail, 0, 1, 2, maxSize * 2);
      }

      // blend mouse + ripple
      let targetSize = lerp(rippleSize, baseSize, mouseInfluence);

      targetSize = constrain(targetSize, 2, maxSize * 2);

      let speed = settings.speed || 0.12;
      size[i][j] = lerp(size[i][j], targetSize, speed);

      // themes
      if (settings.theme === "neon") {
        fill(180, 255, 255, 150);
      } else if (settings.theme === "sunset") {
        fill(255, 120, 80, 150);
      } else {
        fill(0, 180);
      }

      rect(x, y, size[i][j], size[i][j]);
    }
  }

  // update ripple
  if (ripple) {
    ripple.radius += 8;

    let maxScreenDist = dist(0, 0, width, height);
    if (ripple.radius > maxScreenDist) {
      ripple = null;
    }
  }

  // screen flash effect
  if (flashAlpha > 0) {
    fill(255, flashAlpha);
    rect(width / 2, height / 2, width, height);
    flashAlpha *= 0.85; // decay
  }

  if (spacing !== lastSpacing) {
    cols = ceil(width / spacing);
    rows = ceil(height / spacing);

    size = [];
    for (let i = 0; i < cols; i++) {
      size[i] = [];
      for (let j = 0; j < rows; j++) {
        size[i][j] = 0;
      }
    }

    lastSpacing = spacing;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  cols = ceil(width / spacing);
  rows = ceil(height / spacing);

  size = [];
  for (let i = 0; i < cols; i++) {
    size[i] = [];
    for (let j = 0; j < rows; j++) {
      size[i][j] = 0;
    }
  }
}

// click
function mousePressed() {
  ripple = {
    x: mouseX,
    y: mouseY,
    radius: 0
  };

  // trigger flash
  flashAlpha = 120;
}

function loadSettings() {
  settings = JSON.parse(localStorage.getItem("gridSettings")) || {};
  
  spacing = settings.spacing || 20;
}