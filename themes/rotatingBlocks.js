window.registerTheme({
  id: "rotatingBlocks",
  name: "Rotating Blocks",
  previewImage: "assets/theme_preview/rotatingblocks.png",
  create: function createTheme() {
    let blocks = [];
    let cols = 0;
    let rows = 0;
    let blockSize = 10;

    class Block {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.color = 70;
      }

      display(p, offset, hoverDistance, spinSpeed) {
        p.push();
        p.noFill();
        p.stroke(this.color);
        p.translate(this.x, this.y);
        this.mouseHover(p, hoverDistance, spinSpeed);
        p.rotate(this.angle);
        p.rect(0, 0, blockSize - offset, blockSize - offset);
        p.pop();
      }

      mouseHover(p, hoverDistance, spinSpeed) {
        let distance = p.dist(p.mouseX, p.mouseY, this.x, this.y);

        if (distance < hoverDistance) {
          this.angle += spinSpeed;
          this.color = 255;
          return;
        }

        if (this.angle > 0 && this.angle <= 10) {
          this.angle += spinSpeed;
        } else if (this.angle > 10) {
          this.angle = 0;
        }

        if (this.color > 70) {
          this.color -= 3;
        } else {
          this.color = 70;
        }
      }
    }

    function rebuildBlocks(p, settings) {
      blockSize = Math.max(8, settings.spacing || 20);
      cols = p.ceil(p.width / blockSize);
      rows = p.ceil(p.height / blockSize);
      blocks = [];

      for (let i = 0; i < cols; i++) {
        blocks[i] = [];
        for (let j = 0; j < rows; j++) {
          blocks[i][j] = new Block(
            blockSize / 2 + i * blockSize,
            blockSize / 2 + j * blockSize
          );
        }
      }
    }

    return {
      setup(p, settings) {
        p.rectMode(p.CENTER);
        rebuildBlocks(p, settings);
      },

      draw(p, settings) {
        if (blockSize !== Math.max(8, settings.spacing || 20)) {
          rebuildBlocks(p, settings);
        }

        let offset = blockSize * 0.4;
        let hoverDistance = blockSize * 1.5;
        let spinSpeed = p.map(settings.speed || 0.12, 0.05, 0.3, 0.04, 0.22);

        p.background(0);

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            blocks[i][j].display(p, offset, hoverDistance, spinSpeed);
          }
        }
      },

      windowResized(p, settings) {
        rebuildBlocks(p, settings);
      }
    };
  }
});
