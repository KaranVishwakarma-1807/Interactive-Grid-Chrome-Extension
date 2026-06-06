window.registerTheme({
  id: "tenticle",
  name: "Tenticle",
  previewImage: "assets/theme_preview/tenticle.png",
  create: function createTheme() {
    let angles = [];
    let cols = 5;
    let rows = 5;
    let xoff = 0;
    let yoff = 0;
    let inc = 0.7;
    let num = 15;

    function rebuildAngles(p) {
      angles = [];
      xoff = 0;

      for (let i = 0; i < cols; i++) {
        angles[i] = [];
        yoff = 0;

        for (let j = 0; j < rows; j++) {
          angles[i][j] = 360 * p.noise(xoff, yoff);
          yoff += inc;
        }

        xoff += inc;
      }
    }

    return {
      setup(p) {
        p.angleMode(p.DEGREES);
        rebuildAngles(p);
      },

      draw(p, settings) {
        let size = Math.max(16, settings.spacing || 20);
        let radius = size;
        let circleSize = size * 0.5;
        let twist = 10;
        let rotationSpeed = p.map(settings.speed || 0.12, 0.05, 0.3, 1.5, 8);

        p.angleMode(p.DEGREES);
        p.background(0, 0, 0);
        p.translate(p.width / 2, p.height / 2);

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            for (let k = 0; k < num; k++) {
              p.noStroke();
              p.fill(255, 255 * k / (num - 1));

              let progress = k / (num - 1);
              let x = radius * progress * p.cos(angles[i][j] + twist * k);
              let y = radius * progress * p.sin(angles[i][j] + twist * k);
              let xmargin = i * size - size * cols / 2 + size / 2;
              let ymargin = j * size - size * rows / 2 + size / 2;

              p.ellipse(
                xmargin + x + (i - cols / 2) * k * 0.7,
                ymargin + y + (j - rows / 2) * k * 0.7,
                circleSize + k,
                circleSize + k
              );
            }

            angles[i][j] += rotationSpeed;
          }
        }
      },

      windowResized(p) {
        rebuildAngles(p);
      }
    };
  }
});
