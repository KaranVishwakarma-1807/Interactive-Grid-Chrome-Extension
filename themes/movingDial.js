window.registerTheme({
  id: "movingDial",
  name: "Moving Dial",
  previewImage: "assets/theme_preview/movingdial.png",
  create: function createTheme() {
    let dials = [];
    let cols = 0;
    let rows = 0;
    let dialSize = 20;

    class Dial {
      constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
      }

      rotateDial(p) {
        p.push();
        p.translate(this.x, this.y);
        let angle = p.atan2(p.mouseY - this.y, p.mouseX - this.x);
        p.rotate(angle);
        p.rect(0, 0, this.size / 2, this.size);
        p.pop();
      }
    }

    function rebuildDials(p, settings) {
      dialSize = Math.max(10, settings.spacing || 20);
      cols = p.ceil(p.width / dialSize);
      rows = p.ceil(p.height / dialSize);
      dials = [];

      for (let i = 0; i < cols; i++) {
        dials[i] = [];
        for (let j = 0; j < rows; j++) {
          dials[i][j] = new Dial(
            dialSize / 2 + i * dialSize,
            dialSize / 2 + j * dialSize,
            dialSize
          );
        }
      }
    }

    return {
      setup(p, settings) {
        p.rectMode(p.CENTER);
        p.stroke(0, 173, 181);
        p.fill(57, 62, 70);
        rebuildDials(p, settings);
      },

      draw(p, settings) {
        if (dialSize !== Math.max(10, settings.spacing || 20)) {
          rebuildDials(p, settings);
        }

        p.background(34, 40, 49);
        p.stroke(0, 173, 181);
        p.fill(57, 62, 70);

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            dials[i][j].rotateDial(p);
          }
        }
      },

      windowResized(p, settings) {
        rebuildDials(p, settings);
      }
    };
  }
});
