import React, { useRef, useEffect, useState } from 'react';
import './style.css'

const App = () => {
  const canvas = useRef();
  let ctx = null;
  const randColor = () => {
    const r = Math.floor(Math.random() * (256)),
        g = Math.floor(Math.random() * (256)),
        b = Math.floor(Math.random() * (256)),
    color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    return color
  }
  const boxes = [
    { id: 1, x: 200, y: 220, w: 100, h: 50, color: "blue" },
    { id: 2, x: 100, y: 120, w: 100, h: 50, color: "red" }
  ]

  const [rectang, setRectang] = useState(boxes);
  let isDown = false;
  let dragTarget = null;
  let startX = null;
  let startY = null;

  useEffect(() => {
    const canvasEle = canvas.current;
    canvasEle.width = canvasEle.clientWidth;
    canvasEle.height = canvasEle.clientHeight;
    ctx = canvasEle.getContext("2d");
  }, []);

  useEffect(() => {
    draw();
  }, []);

  useEffect(() => {
    const canvasEle = canvas.current;
    canvasEle.width = canvasEle.clientWidth;
    canvasEle.height = canvasEle.clientHeight;
    ctx = canvasEle.getContext("2d");
    draw();
  }, [rectang]);

  const draw = () => {
    ctx.clearRect(0, 0, canvas.current.clientWidth, canvas.current.clientHeight);
    rectang.map(info => drawFillRect(info));
  }

  const drawFillRect = (info, style = {}) => {
    const { x, y, w, h } = info;
    const { backgroundColor = info.color } = style;
    ctx.beginPath();
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x, y, w, h);
  }

  const hitBox = (x, y) => {
    let isTarget = null;
    for (let i = 0; i < rectang.length; i++) {
      const box = rectang[i];
      if (x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h) {
        dragTarget = box;
        isTarget = true;
        break;
      }
    }
    return isTarget;
  }

  const handleMouseDown = e => {
    const rect = canvas.current.getBoundingClientRect()
    startX = parseInt(e.clientX - rect.left);
    startY = parseInt(e.clientY - rect.top);
    isDown = hitBox(startX, startY);

  }

  const handleMouseMove = e => {
    if (!isDown) return;
    const rect = canvas.current.getBoundingClientRect()
    const mouseX = parseInt(e.clientX - rect.left);
    const mouseY = parseInt(e.clientY - rect.top);
    const dx = mouseX - startX;
    const dy = mouseY - startY;
    startX = mouseX;
    startY = mouseY;
    dragTarget.x += dx;
    dragTarget.y += dy;
    if (dragTarget.x < 0) {
      dragTarget.x = 0;
    }
    if (dragTarget.y < 0) {
      dragTarget.y = 0;
    }
    draw();
  }
  const handleMouseUp = e => {
    if (dragTarget) {
    rectang.forEach(el => {
      if (el.id !== dragTarget.id) {
        if ((dragTarget.x > el.x && dragTarget.x < (el.x + 100)) && (((dragTarget.y > el.y && dragTarget.y < (el.y + 50))) || (((dragTarget.y + 50) > el.y && (dragTarget.y + 50) < (el.y + 50))))) {
          const dX = dragTarget.x  - el.x
          const dY = dragTarget.y - el.y
          console.log('dragTarget.x = ', dragTarget.x)
          console.log('dragTarget.y = ', dragTarget.y)
          console.log('el.x = ', el.x)
          console.log('el.y = ', el.y)
          if (dX < dY) {
            dragTarget.x = dragTarget.x - dX + 1
          } else {
            dragTarget.y = dragTarget.y - dY + 1
          }
          dragTarget.x = el.x + 101;
        } else if (((dragTarget.x + 100) >= el.x && (dragTarget.x + 100) <= (el.x + 100)) && (((dragTarget.y > el.y && dragTarget.y < (el.y + 50))) || (((dragTarget.y + 50) > el.y && (dragTarget.y + 50) < (el.y + 50)))))  {
          const dX = (dragTarget.x + 100) - el.x
          const dY = (dragTarget.y + 50) - el.y
          console.log('dragTarget1.x = ', dragTarget.x)
          console.log('dragTarget1.y = ', dragTarget.y)
          console.log('el1.x = ', el.x)
          console.log('el1.y = ', el.y)
          if (dX < dY) {
            dragTarget.x = dragTarget.x - dX + 1
          } else {
            dragTarget.y = dragTarget.y - dY + 1
          }
          //dragTarget.y = dragTarget.x - ((dragTarget.x + 100) - el.x + 1);
        }
      }
    })
    draw();
    }
    dragTarget = null;
    isDown = false;
  }
  const handleMouseOut = e => {
    handleMouseUp(e);
  }

  const handleDoubleClick = e => {
    const color = randColor();
    const rect = canvas.current.getBoundingClientRect()
    const mouseX = parseInt(e.clientX - rect.left);
    const mouseY = parseInt(e.clientY - rect.top);
    const newRect = { id: rectang.length + 1, x: mouseX, y: mouseY, w: 100, h: 50, color: color }
    let borders = false;
    rectang.forEach(el => {
      if (mouseX >= el.x && mouseX <= (el.x + 100) && mouseY >= el.y && mouseY <= (el.y + 50)) {
        borders = true
        console.log("case1")
      } else if (((mouseX >= el.x && mouseX <= (el.x + 100)) || ((mouseX + 100) >= el.x && (mouseX + 100) <= (el.x + 100))) && 
      ((mouseY >= el.y && mouseY <= (el.y + 50)) || ((mouseY + 50) >= el.y && (mouseY + 50) <= (el.y + 50)))) {
        borders = true
        console.log("case2")
      }
    })
    if (newRect.x < 0 || newRect.y < 0 || borders) {
      return;
    }
    setRectang([...rectang, newRect]);
  }

  /*const handleClick = e => { 
    const rect = canvas.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    console.log("x: " + x + " y: " + y)
}*/

  return (
    <div className="App">
      <canvas
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
        //onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        ref={canvas}
      >
      </canvas>
    </div>
  );
}

export { App };

