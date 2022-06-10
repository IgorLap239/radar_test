import React, { useRef, useEffect, useState } from 'react';
import './CanvasElement.css'

const CanvasElement = () => {
  const canvas = useRef();
  let ctx = null;
  const defaultRectangles = [
    { id: 0, x: 200, y: 220, color: "blue", connect:[] },
    { id: 1, x: 100, y: 120, color: "red", connect:[] },
  ]
  const connectRect = [];
  let isDown = false;
  let dragTarget = null;
  let startX = null;
  let startY = null;
  let tmpX = null;
  let tmpY = null;
  const width = 100;
  const height = width/2;
  const [rectangles, setRectangles] = useState(defaultRectangles);
  const [size, setSize] = useState(true);

  useEffect(() => {
    window.onresize = resizeHanlder;
  }, []);

  useEffect(() => {
    const canvasEle = canvas.current;
    canvasEle.width = canvasEle.clientWidth;
    canvasEle.height = canvasEle.clientHeight;
    ctx = canvasEle.getContext("2d");
    draw();
  }, [rectangles, size]);

  const resizeHanlder = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    setSize({
      windowWidth: windowWidth,
      windowHeight: windowHeight,
    });
  };

  const randColor = () => {
    const r = Math.floor(Math.random() * (256)),
        g = Math.floor(Math.random() * (256)),
        b = Math.floor(Math.random() * (256)),
    color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    return color
  }

  const draw = () => {
    ctx.clearRect(0, 0, canvas.current.clientWidth, canvas.current.clientHeight);
    rectangles.map(rectangle => drawLine(rectangle));
    rectangles.map(rectangle => drawFillRect(rectangle));
  }

  const drawLine = (rectangle) => {
    if (rectangle.connect.length > 0) {
      let x = 0;
      let y = 0;
      let x1 = 0;
      let y1 = 0;
      rectangle.connect.forEach(con => {
          rectangles.map(rect => {
            if (rect.id === con[0]) {
              x = rect.x + width/2;
              y = rect.y + height/2;
            } else if (rect.id === con[1]) {
              x1 = rect.x + width/2;
              y1 = rect.y + height/2;
            }
            return null;
          })
          ctx.moveTo(x, y)
          ctx.lineTo(x1, y1)
      })
      ctx.stroke()
    }
  }

  const drawFillRect = (rectangle, style = {}) => {
    const { x, y } = rectangle;
    const { backgroundColor = rectangle.color } = style;
    ctx.beginPath();
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x, y, width, height);
  }

  const hitBox = (x, y) => {
    let isTarget = null;
    for (let i = 0; i < rectangles.length; i++) {
      const box = rectangles[i];
      if (x >= box.x && x <= box.x + width && y >= box.y && y <= box.y + height) {
        dragTarget = box;
        isTarget = true;
        tmpX = dragTarget.x;
        tmpY = dragTarget.y;
        break;
      }
    }
    return isTarget;
  }

  const handleMouseDown = e => {
    if (e.button === 0) {
      const rect = canvas.current.getBoundingClientRect()
      startX = parseInt(e.clientX - rect.left);
      startY = parseInt(e.clientY - rect.top);
      isDown = hitBox(startX, startY);
    }
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
    if ((dragTarget.x + width) > window.innerWidth * 0.8) {
      dragTarget.x = window.innerWidth * 0.8 - width;
    }
    if ((dragTarget.y + height) > window.innerHeight * 0.9) {
      dragTarget.y = window.innerHeight * 0.9 - height;
    }
    draw();
  }

  const handleMouseUp = e => {
    if (dragTarget) {
      checkPosition();
      draw();
    }
    dragTarget = null;
    isDown = false;
  }

  const checkPosition = () => {
    rectangles.forEach(rect => {
      if (rect.id !== dragTarget.id) {
        if (((dragTarget.x > rect.x && dragTarget.x < (rect.x + width)) && (((dragTarget.y >= rect.y && dragTarget.y <= (rect.y + height))) ||
           (((dragTarget.y + height) >= rect.y && (dragTarget.y + height) <= (rect.y + height))))) || 
           (((dragTarget.x + width) >= rect.x && (dragTarget.x + width) <= (rect.x + width)) && (((dragTarget.y >= rect.y && dragTarget.y <= (rect.y + height))) ||
           (((dragTarget.y + height) >= rect.y && (dragTarget.y + height) <= (rect.y + height)))))) 
        {
          dragTarget.x = tmpX;
          dragTarget.y = tmpY;
        }
      }
    })
  }

  const handleMouseOut = e => {
    handleMouseUp(e);
  }

  const handleDoubleClick = e => {
    const color = randColor();
    const rect = canvas.current.getBoundingClientRect()
    const mouseX = parseInt(e.clientX - rect.left);
    const mouseY = parseInt(e.clientY - rect.top);
    let newRect = { id: rectangles.length, x: mouseX-width/2, y: mouseY-height/2, color: color, connect: [] }
    let check = false;
    check = checkCreateArea(newRect.x, newRect.y);
    if (check) {
      let indexX = 0;
      let indexY = 0;
      let newX = newRect.x - width/2;
      let newY = newRect.y - height/2;
      do {
        if (indexY < height ) {
          if (indexX < width ) {
            newX = (newRect.x - width/2) + indexX;
            indexX += 1;
          } else {
            newY = (newRect.y - height/2) + indexY;
            indexY += 1;
            newX = newRect.x - width/2;
            indexX = 0;
          }
        }
        check = checkCreateArea(newX, newY);
        if (!check) {
          indexY = height;
          newRect.x = newX;
          newRect.y = newY;
        }
      } while (indexY < height)
    }
    if (newRect.x < 0 || newRect.y < 0 || check || ((newRect.x + width) > window.innerWidth * 0.8) || ((newRect.y + height) > window.innerHeight * 0.9)) {
      return;
    }
    setRectangles([...rectangles, newRect]);
  }

  const checkCreateArea = (x, y) => {
    let restrictions = false;
    rectangles.forEach(rect => {
      if (x >= rect.x && x <= (rect.x + width) && y >= rect.y && y <= (rect.y + height)) {
        restrictions = true;
      } else if (((x >= rect.x && x <= (rect.x + width)) || ((x + width) >= rect.x && (x + 100) <= (rect.x + 100))) && 
      ((y >= rect.y && y <= (rect.y + 50)) || ((y + 50) >= rect.y && (y + 50) <= (rect.y + 50)))) {
        restrictions = true;
      }
    })
    return restrictions;
  }

  const handleClick = (e) => {
    e.preventDefault();
    const rect = canvas.current.getBoundingClientRect()
    const x = parseInt(e.clientX - rect.left);
    const y = parseInt(e.clientY - rect.top);
    for (let i = 0; i < rectangles.length; i++) {
      const rect = rectangles[i];
      if (x >= rect.x && x <= rect.x + width && y >= rect.y && y <= rect.y + height) {
        connectRect.push(rect.id)
        break;
      }
    }
    if (connectRect.length === 2) {
      if (connectRect[0] !== connectRect[1]) {
        setRectangles(rectangles.map(rect => {
          let newa = [];
          if (rect.id === connectRect[0] || rect.id === connectRect[1]) {
            let checkConnect = false;
            rect.connect.map((con, i) => {
              const reverseArr = JSON.parse(JSON.stringify(connectRect))
              if (JSON.stringify(con) === JSON.stringify(connectRect) || JSON.stringify(con) === JSON.stringify(reverseArr.reverse())) {
                checkConnect = true;
                newa = rect.connect.filter((_, ind) => i !== ind);
              }
              return null;
            })
            if (!checkConnect) {
              return {...rect, "connect": [...rect.connect, [connectRect[0], connectRect[1]]]}
            } else {
              return {...rect, "connect": newa}
            }
          } else {
            return rect;
          }
        })
        )
        connectRect.length = 0
        draw();
      }
    }
  };

  return (
    <canvas
      className='canvas'
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      onContextMenu={handleClick}
      onDoubleClick={handleDoubleClick}
      ref={canvas}
    >
    </canvas>
  );
}

export { CanvasElement };

