document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const scoreEl = document.getElementById('score');
    const w = 10;
    const h = 20;
    let cells = [];
    let score = 0;
  
    for (let i = 0; i < w * h; i++) {
      const cell = document.createElement('div');
      grid.appendChild(cell);
      cells.push(cell);
    }
  
    const lShape = [
      [1, w + 1, w * 2 + 1, 2],
      [w, w + 1, w + 2, w * 2 + 2],
      [1, w + 1, w * 2 + 1, w * 2],
      [w, w * 2, w * 2 + 1, w * 2 + 2]
    ];
  
    const zShape = [
      [0, w, w + 1, w * 2 + 1],
      [w + 1, w + 2, w * 2, w * 2 + 1],
      [0, w, w + 1, w * 2 + 1],
      [w + 1, w + 2, w * 2, w * 2 + 1]
    ];
  
    const tShape = [
      [1, w, w + 1, w + 2],
      [1, w + 1, w + 2, w * 2 + 1],
      [w, w + 1, w + 2, w * 2 + 1],
      [1, w, w + 1, w * 2 + 1]
    ];
  
    const oShape = [
      [0, 1, w, w + 1],
      [0, 1, w, w + 1],
      [0, 1, w, w + 1],
      [0, 1, w, w + 1]
    ];
  
    const iShape = [
      [1, w + 1, w * 2 + 1, w * 3 + 1],
      [w, w + 1, w + 2, w + 3],
      [1, w + 1, w * 2 + 1, w * 3 + 1],
      [w, w + 1, w + 2, w + 3]
    ];
  
    const shapes = [lShape, zShape, tShape, oShape, iShape];
  
    let random = Math.floor(Math.random() * shapes.length);
    let rotation = 0;
    let current = shapes[random][rotation];
    let pos = 4;
  
    function draw() {
      current.forEach(index => {
        cells[pos + index].classList.add('tetromino');
        cells[pos + index].style.backgroundColor = 'orange';
      });
    }
  
    function undraw() {
      current.forEach(index => {
        cells[pos + index].classList.remove('tetromino');
        cells[pos + index].style.backgroundColor = '';
      });
    }
  
    function moveDown() {
      undraw();
      pos += w;
      draw();
      freeze();
    }
  
    function freeze() {
      if (current.some(index => cells[pos + index + w]?.classList.contains('taken') || (pos + index + w) >= w * h)) {
        current.forEach(index => cells[pos + index].classList.add('taken'));
        random = Math.floor(Math.random() * shapes.length);
        rotation = 0;
        current = shapes[random][rotation];
        pos = 4;
        draw();
        updateScore();
        checkGameOver();
      }
    }
  
    function rotate() {
      undraw();
      rotation = (rotation + 1) % shapes[random].length;
      current = shapes[random][rotation];
      draw();
    }
  
    function updateScore() {
      for (let i = 0; i < h; i++) {
        const row = Array.from({ length: w }, (_, k) => i * w + k);
        if (row.every(index => cells[index].classList.contains('taken'))) {
          score += 10;
          scoreEl.textContent = score;
          row.forEach(index => {
            cells[index].classList.remove('taken');
            cells[index].classList.remove('tetromino');
            cells[index].style.backgroundColor = '';
          });
          const removed = cells.splice(i * w, w);
          cells = removed.concat(cells);
          cells.forEach(cell => grid.appendChild(cell));
        }
      }
    }
  
    function checkGameOver() {
      if (current.some(index => cells[pos + index].classList.contains('taken'))) {
        alert('Game Over!');
        clearInterval(timer);
      }
    }
  
    function control(e) {
      if (e.keyCode === 37) {
        moveLeft();
      } else if (e.keyCode === 39) {
        moveRight();
      } else if (e.keyCode === 40) {
        moveDown();
      } else if (e.keyCode === 38) {
        rotate();
      }
    }
  
    document.addEventListener('keydown', control);
  
    function moveLeft() {
      undraw();
      const atLeftEdge = current.some(index => (pos + index) % w === 0);
      if (!atLeftEdge) pos -= 1;
      if (current.some(index => cells[pos + index].classList.contains('taken'))) {
        pos += 1;
      }
      draw();
    }
  
    function moveRight() {
      undraw();
      const atRightEdge = current.some(index => (pos + index) % w === w - 1);
      if (!atRightEdge) pos += 1;
      if (current.some(index => cells[pos + index].classList.contains('taken'))) {
        pos -= 1;
      }
      draw();
    }
  
    const timer = setInterval(moveDown, 1000);
  });
  