window.registerTheme({
  id: "rotatingPacman",
  name: "Rotating Pacman",
  previewImage: "assets/theme_preview/rotatingpacman.png",
  create: function createTheme() {
    let pacmans = [];
    let cols = 0;
    let rows = 0;
    let pacmanSize = 50;
    let offset = 5;

    function easeInOutQuint(x) {
      return x < 0.5
        ? 16 * x * x * x * x * x
        : 1 - Math.pow(-2 * x + 2, 5) / 2;
    }

    class Pacman {
      constructor(x, y, startingArc) {
        this.x = x;
        this.y = y;
        this.startingArc = startingArc;
        this.endingArc = this.startingArc + 270;
        this.angle = 0;
        this.amt = 0;
      }

      display(p) {
        p.stroke(221, 230, 237);
        p.fill(39, 55, 77);
        p.push();
        p.translate(this.x, this.y);
        p.arc(
          0,
          0,
          pacmanSize - offset,
          pacmanSize - offset,
          this.startingArc + this.angle,
          this.endingArc + this.angle
        );
        p.pop();
      }

      move(step) {
        if (this.amt > 1) {
          this.amt = 0;
        } else {
          this.amt += step;
        }

        this.angle = easeInOutQuint(this.amt) * 360;
      }
    }

    function getStartingAngle(i, j) {
      if (j % 2 === 0) {
        return i % 2 === 0 ? 90 : 180;
      }

      return i % 2 === 0 ? 0 : 270;
    }

    function rebuildPacmans(p, settings) {
      pacmanSize = Math.max(24, settings.spacing || 50);
      offset = Math.max(4, pacmanSize * 0.1);
      cols = p.ceil(p.width / pacmanSize);
      rows = p.ceil(p.height / pacmanSize);
      pacmans = [];

      for (let i = 0; i < cols; i++) {
        pacmans[i] = [];
        for (let j = 0; j < rows; j++) {
          pacmans[i][j] = new Pacman(
            pacmanSize / 2 + i * pacmanSize,
            pacmanSize / 2 + j * pacmanSize,
            getStartingAngle(i, j)
          );
        }
      }
    }

    return {
      setup(p, settings) {
        p.angleMode(p.DEGREES);
        p.fill(255, 221, 0);
        rebuildPacmans(p, settings);
      },

      draw(p, settings) {
        if (pacmanSize !== Math.max(24, settings.spacing || 50)) {
          rebuildPacmans(p, settings);
        }

        let step = p.map(settings.speed || 0.12, 0.05, 0.3, 0.004, 0.025);

        p.angleMode(p.DEGREES);
        p.background(82, 109, 130);
        // p.fill(255, 221, 0);

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            pacmans[i][j].display(p);
            pacmans[i][j].move(step);
          }
        }
      },

      windowResized(p, settings) {
        rebuildPacmans(p, settings);
      }
    };
  }
});
