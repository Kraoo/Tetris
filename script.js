document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');
  const scoreEl = document.getElementById('score');
  const w = 10;
  const h = 20;
  let cells = [];
  let score = 0;
  let speed = 1000;
  let level = 1; 

  for (let i = 0; i < w * h; i++) {
    const cell = document.createElement('div');
    grid.appendChild(cell);
    cells.push(cell);
  }

  class Shape {
    constructor(rotations, color) {
      this.rotations = rotations;
      this.color = color;
      this.rotationIndex = 0;
    }

    get current() {
      return this.rotations[this.rotationIndex];
    }

    rotate() {
      this.rotationIndex = (this.rotationIndex + 1) % this.rotations.length;
    }
  }

  const shapes = [
    new Shape([
      [1, w + 1, w * 2 + 1, 2],
      [w, w + 1, w + 2, w * 2 + 2],
      [1, w + 1, w * 2 + 1, w * 2],
      [w, w * 2, w * 2 + 1, w * 2 + 2]
    ], 'orange'),
    new Shape([
      [0, w, w + 1, w * 2 + 1],
      [w + 1, w + 2, w * 2, w * 2 + 1],
      [0, w, w + 1, w * 2 + 1],
      [w + 1, w + 2, w * 2, w * 2 + 1]
    ], 'red'),
    new Shape([
      [1, w, w + 1, w + 2],
      [1, w + 1, w + 2, w * 2 + 1],
      [w, w + 1, w + 2, w * 2 + 1],
      [1, w, w + 1, w * 2 + 1]
    ], 'purple'),
    new Shape([
      [0, 1, w, w + 1],
      [0, 1, w, w + 1],
      [0, 1, w, w + 1],
      [0, 1, w, w + 1]
    ], 'yellow'),
    new Shape([
      [1, w + 1, w * 2 + 1, w * 3 + 1],
      [w, w + 1, w + 2, w + 3],
      [1, w + 1, w * 2 + 1, w * 3 + 1],
      [w, w + 1, w + 2, w + 3]
    ], 'cyan')
  ];

  class Tetris {
    constructor(grid, cells, shapes, scoreEl) {
      this.grid = grid;
      this.cells = cells;
      this.shapes = shapes;
      this.scoreEl = scoreEl;
      this.score = 0;
      this.timer = null;
      this.currentShape = this.randomShape();
      this.pos = 4;
      this.draw();
      document.addEventListener('keydown', this.control.bind(this));
      this.startTimer();
    }

    startTimer() {
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(this.moveDown.bind(this), speed);
    }

    randomShape() {
      const randomIndex = Math.floor(Math.random() * this.shapes.length);
      return this.shapes[randomIndex];
    }

    draw() {
      this.currentShape.current.forEach(index => {
        this.cells[this.pos + index].classList.add('tetromino');
        this.cells[this.pos + index].style.backgroundColor = this.currentShape.color;
      });
    }

    undraw() {
      this.currentShape.current.forEach(index => {
        this.cells[this.pos + index].classList.remove('tetromino');
        this.cells[this.pos + index].style.backgroundColor = '';
      });
    }

    moveDown() {
      this.undraw();
      this.pos += w;
      this.draw();
      this.freeze();
    }

    freeze() {
      if (this.currentShape.current.some(index => this.cells[this.pos + index + w]?.classList.contains('taken') || (this.pos + index + w) >= w * h)) {
        this.currentShape.current.forEach(index => this.cells[this.pos + index].classList.add('taken'));
        this.currentShape = this.randomShape();
        this.pos = 4;
        this.draw();
        this.updateScore();
        this.checkGameOver();
        this.increaseSpeed();
      }
    }

    rotate() {
      this.undraw();
      this.currentShape.rotate();
      this.draw();
    }

    updateScore() {
      for (let i = 0; i < h; i++) {
        const row = Array.from({ length: w }, (_, k) => i * w + k);
        if (row.every(index => this.cells[index].classList.contains('taken'))) {
          this.score += 10;
          this.scoreEl.textContent = this.score;
          row.forEach(index => {
            this.cells[index].classList.remove('taken');
            this.cells[index].classList.remove('tetromino');
            this.cells[index].style.backgroundColor = '';
          });
          const removed = this.cells.splice(i * w, w);
          this.cells = removed.concat(this.cells);
          this.cells.forEach(cell => this.grid.appendChild(cell));
        }
      }
    }

    checkGameOver() {
      if (this.currentShape.current.some(index => this.cells[this.pos + index].classList.contains('taken'))) {
        alert('Game Over!');
        clearInterval(this.timer);
      }
    }

    control(e) {
      if (e.keyCode === 37) {
        this.moveLeft();
      } else if (e.keyCode === 39) {
        this.moveRight();
      } else if (e.keyCode === 40) {
        this.moveDown();
      } else if (e.keyCode === 38) {
        this.rotate();
      }
    }

    moveLeft() {
      this.undraw();
      const atLeftEdge = this.currentShape.current.some(index => (this.pos + index) % w === 0);
      if (!atLeftEdge) this.pos -= 1;
      if (this.currentShape.current.some(index => this.cells[this.pos + index].classList.contains('taken'))) {
        this.pos += 1;
      }
      this.draw();
    }

    moveRight() {
      this.undraw();
      const atRightEdge = this.currentShape.current.some(index => (this.pos + index) % w === w - 1);
      if (!atRightEdge) this.pos += 1;
      if (this.currentShape.current.some(index => this.cells[this.pos + index].classList.contains('taken'))) {
        this.pos -= 1;
      }
      this.draw();
    }

    increaseSpeed() {
      if (this.score >= level * 50) {
        level++;
        speed = Math.max(100, speed - 100);
        this.startTimer();
      }
    }
  }

  new Tetris(grid, cells, shapes, scoreEl);
});