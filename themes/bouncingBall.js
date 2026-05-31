window.registerTheme({
  id: "bouncingBall",
  name: "Bouncing Ball",
  previewImage: "assets/theme_preview/bouncingball.png",
  create: function createTheme() {
    let ballX = 100;
    let ballY = 100;
    let dx = 5;
    let dy = 5;

    return {
      setup(p) {
        p.stroke(225);
      },

      draw(p, settings) {
        let gridSize = Math.max(8, settings.spacing || 20);
        let speed = p.map(settings.speed || 0.12, 0.05, 0.3, 2, 9);
        let cols = p.ceil(p.width / gridSize);
        let rows = p.ceil(p.height / gridSize);
        let scale = 0.08;

        p.background(0);
        p.stroke(225);
        p.strokeWeight(1);

        ballX += dx > 0 ? speed : -speed;
        ballY += dy > 0 ? speed : -speed;

        if (ballX > p.width || ballX < 0) {
          dx *= -1;
        }

        if (ballY > p.height || ballY < 0) {
          dy *= -1;
        }

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            let x = gridSize / 2 + i * gridSize;
            let y = gridSize / 2 + j * gridSize;
            let lineLength = p.dist(ballX, ballY, x, y) * scale;

            p.line(
              x - lineLength,
              y - lineLength,
              x + lineLength,
              y + lineLength
            );
          }
        }
      }
    };
  }
});
