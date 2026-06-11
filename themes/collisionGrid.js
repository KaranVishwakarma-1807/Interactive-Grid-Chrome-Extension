window.registerTheme({
  id: "collisionGrid",
  name: "Collision Grid",
  previewImage: "assets/theme_preview/collisiongrid.png",

  create: function createTheme() {
    let rectangles = [];
    let cols = 0;
    let rows = 0;
    let currentSize = 0;

    let lastWidth = 0;
    let lastHeight = 0;

    class Rectangle {
      constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.collide = false;
      }

      drawRect(p) {
        if (this.collide) {
          p.fill(255, 220, 0);
        } else {
          p.fill(35);
        }

        p.stroke(80);
        p.rect(this.x, this.y, this.w, this.h);
      }

      collided(p, cx, cy, cr) {
        let closeX = cx;
        let closeY = cy;

        if (cx > this.x + this.w) {
          closeX = this.x + this.w;
        } else if (cx < this.x) {
          closeX = this.x;
        }

        if (cy > this.y + this.h) {
          closeY = this.y + this.h;
        } else if (cy < this.y) {
          closeY = this.y;
        }

        const distX = cx - closeX;
        const distY = cy - closeY;

        const distance = p.sqrt(
          distX * distX + distY * distY
        );

        this.collide = distance <= cr;
      }
    }

    function buildGrid(p, size) {
      rectangles = [];

      // +1 ensures no gaps appear on edges
      cols = Math.ceil(p.width / size) + 1;
      rows = Math.ceil(p.height / size) + 1;

      for (let i = 0; i < cols; i++) {
        rectangles[i] = [];

        for (let j = 0; j < rows; j++) {
          rectangles[i][j] = new Rectangle(
            i * size,
            j * size,
            size,
            size
          );
        }
      }
    }

    return {
      setup(p) {
        currentSize = 80;

        lastWidth = p.width;
        lastHeight = p.height;

        buildGrid(p, currentSize);
      },

      draw(p, settings) {
        const gridSize = Math.max(
          30,
          settings.spacing || 80
        );

        const radius = p.map(
          settings.speed || 0.12,
          0.05,
          0.3,
          5,
          40
        );

        // Rebuild if spacing changes
        if (gridSize !== currentSize) {
          currentSize = gridSize;
          buildGrid(p, currentSize);
        }

        // Rebuild if canvas size changes
        if (
          p.width !== lastWidth ||
          p.height !== lastHeight
        ) {
          lastWidth = p.width;
          lastHeight = p.height;

          buildGrid(p, currentSize);
        }

        p.background(15);

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            rectangles[i][j].collided(
              p,
              p.mouseX,
              p.mouseY,
              radius
            );

            rectangles[i][j].drawRect(p);
          }
        }

        // Cursor indicator
        p.noStroke();
        p.fill(255, 100, 100);
        p.circle(
          p.mouseX,
          p.mouseY,
          radius * 2
        );
      }
    };
  }
});