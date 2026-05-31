function createInteractiveGridTheme(variant) {
  let cols;
  let rows;
  let spacing = 20;
  let sizes = [];
  let bgColor;
  let ripple = null;
  let flashAlpha = 0;
  let smoothX = 0;
  let smoothY = 0;
  let mouseInfluence = 1;

  function rebuildGrid(p) {
    cols = p.ceil(p.width / spacing);
    rows = p.ceil(p.height / spacing);
    sizes = [];

    for (let i = 0; i < cols; i++) {
      sizes[i] = [];
      for (let j = 0; j < rows; j++) {
        sizes[i][j] = 0;
      }
    }
  }

  return {
    setup(p, settings) {
      p.rectMode(p.CENTER);
      p.noStroke();
      bgColor = p.color(10, 25, 30);
      spacing = settings.spacing || 20;
      rebuildGrid(p);
    },

    draw(p, settings) {
      if (spacing !== (settings.spacing || 20)) {
        spacing = settings.spacing || 20;
        rebuildGrid(p);
      }

      let targetBg = p.color(
        p.map(p.mouseX, 0, p.width, 50, 150),
        p.map(p.mouseY, 0, p.height, 50, 150),
        p.map(p.mouseX + p.mouseY, 0, p.width + p.height, 80, 180)
      );

      bgColor = p.lerpColor(bgColor, targetBg, 0.05);
      p.background(bgColor);

      smoothX = p.lerp(smoothX, p.mouseX, 0.2);
      smoothY = p.lerp(smoothY, p.mouseY, 0.2);

      let maxDist = 125;
      let maxSize = spacing;
      mouseInfluence = ripple
        ? p.lerp(mouseInfluence, 0, 0.08)
        : p.lerp(mouseInfluence, 1, 0.05);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let x = spacing / 2 + i * spacing;
          let y = spacing / 2 + j * spacing;
          let distance = p.dist(smoothX, smoothY, x, y);
          let baseSize = p.map(distance, 0, maxDist, 2, maxSize);
          let rippleSize = baseSize;

          if (ripple) {
            let rippleDistance = p.dist(x, y, ripple.x, ripple.y);
            let waveWidth = 25;
            let diff = p.abs(rippleDistance - ripple.radius);
            let wave = p.exp(-p.pow(diff / waveWidth, 2));
            let tail = p.exp(-rippleDistance * 0.002);
            rippleSize = p.map(wave * tail, 0, 1, 2, maxSize * 2);
          }

          let targetSize = p.lerp(rippleSize, baseSize, mouseInfluence);
          targetSize = p.constrain(targetSize, 2, maxSize * 2);
          sizes[i][j] = p.lerp(sizes[i][j], targetSize, settings.speed || 0.12);

          if (variant === "neon") {
            p.fill(180, 255, 255, 150);
          } else if (variant === "sunset") {
            p.fill(255, 120, 80, 150);
          } else {
            p.fill(0, 180);
          }

          p.rect(x, y, sizes[i][j], sizes[i][j]);
        }
      }

      if (ripple) {
        ripple.radius += 8;

        if (ripple.radius > p.dist(0, 0, p.width, p.height)) {
          ripple = null;
        }
      }

      if (flashAlpha > 0) {
        p.fill(255, flashAlpha);
        p.rect(p.width / 2, p.height / 2, p.width, p.height);
        flashAlpha *= 0.85;
      }
    },

    windowResized(p, settings) {
      spacing = settings.spacing || 20;
      rebuildGrid(p);
    },

    mousePressed(p) {
      ripple = {
        x: p.mouseX,
        y: p.mouseY,
        radius: 0
      };
      flashAlpha = 120;
    }
  };
}

window.registerTheme({
  id: "ocean",
  name: "Ocean",
  previewImage: "assets/theme_preview/ocean.png",
  create: function createTheme() {
    return createInteractiveGridTheme("ocean");
  }
});

window.registerTheme({
  id: "neon",
  name: "Neon",
  previewImage: "assets/theme_preview/neon.png",
  create: function createTheme() {
    return createInteractiveGridTheme("neon");
  }
});

window.registerTheme({
  id: "sunset",
  name: "Sunset",
  previewImage: "assets/theme_preview/sunset.png",
  create: function createTheme() {
    return createInteractiveGridTheme("sunset");
  }
});
