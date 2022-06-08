import React, { useRef, useEffect, useState } from 'react';
import './CanvasElement.css'

const CanvasElement = () => {
  const canvas = useRef();
  let ctx = null;
  const boxes = [
    { id: 0, x: 200, y: 220, color: "blue", connect:[/*[1,3]*/] },
    { id: 1, x: 100, y: 120, color: "red", connect:[/*[2,1]*/] },
    { id: 2, x: 400, y: 320, color: "green", connect:[/*[3,2]*/] }
  ]
  const connectRect = [];
  const [rectang, setRectang] = useState(boxes);
  let isDown = false;
  let dragTarget = null;
  let startX = null;
  let startY = null;
  let checked = true;
  let right = 0;
  let left = 0;
  let top = 0;
  let bottom = 0;
  const width = 100;
  const height = 50;

  useEffect(() => {
    const canvasEle = canvas.current;
    canvasEle.width = canvasEle.clientWidth;
    canvasEle.height = canvasEle.clientHeight;
    ctx = canvasEle.getContext("2d");
  }, []);

  useEffect(() => {
    console.log('rectang = ', rectang);
    const canvasEle = canvas.current;
    canvasEle.width = canvasEle.clientWidth;
    canvasEle.height = canvasEle.clientHeight;
    ctx = canvasEle.getContext("2d");
    draw();
  }, [rectang]);

  const randColor = () => {
    const r = Math.floor(Math.random() * (256)),
        g = Math.floor(Math.random() * (256)),
        b = Math.floor(Math.random() * (256)),
    color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    return color
  }

  const draw = () => {
    ctx.clearRect(0, 0, canvas.current.clientWidth, canvas.current.clientHeight);
    rectang.map(info => drawLine(info));
    rectang.map(info => drawFillRect(info));
  }

  const drawLine = (info) => {
    if (info.connect) {
      let x = 0;
      let y = 0;
      let x1 = 0;
      let y1 = 0;
      info.connect.forEach((elem) => {
          rectang.map(el => {
            if (el.id === elem[0]) {
              x = el.x + width/2;
              y = el.y + height/2;
            } else if (el.id === elem[1]) {
              x1 = el.x + width/2;
              y1 = el.y + height/2;
            }
            return null;
          })
          ctx.moveTo(x, y)
          ctx.lineTo(x1, y1)
      })
      ctx.stroke()
    }
  }

  const drawFillRect = (info, style = {}) => {
    const { x, y } = info;
    const { backgroundColor = info.color } = style;
    ctx.beginPath();
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x, y, width, height);
  }

  const hitBox = (x, y) => {
    let isTarget = null;
    for (let i = 0; i < rectang.length; i++) {
      const box = rectang[i];
      if (x >= box.x && x <= box.x + width && y >= box.y && y <= box.y + height) {
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
      checkPosition();
    if (dragTarget.x < 0) {
      dragTarget.x = 0;
      dragTarget.y += (height + 1)
      checkPosition();
    }
    if (dragTarget.y < 0) {
      dragTarget.y = 0;
      dragTarget.x += (width + 1);
      checkPosition();
    }
    draw();
    }
    dragTarget = null;
    isDown = false;
  }

  const checkPosition = () => {
    checked = true;
    rectang.forEach(el => {
      if (el.id !== dragTarget.id) {
        if ((dragTarget.x > el.x && dragTarget.x < (el.x + width)) && (((dragTarget.y >= el.y && dragTarget.y <= (el.y + height))) || (((dragTarget.y + height) >= el.y && (dragTarget.y + height) <= (el.y + height))))) {
          const dY = dragTarget.y - el.y
          if (dY < 30 && dY > -20) {
            //dragTarget.x = el.x + 101 * left;
            dragTarget.x = el.x + (width + 1) + ((width + 1) * left);
            left += 1;
          } else if (dY > 30) {
            dragTarget.y = el.y + (height + 1) + ((height + 1) * top);
            top += 1; 
          } else if (dY < 0) {
            dragTarget.y = el.y - (height + 1) + ((height + 1) * bottom);
            bottom += 1;
          }
          checked = false;
        } else if (((dragTarget.x + width) >= el.x && (dragTarget.x + width) <= (el.x + width)) && (((dragTarget.y >= el.y && dragTarget.y <= (el.y + height))) || (((dragTarget.y + height) >= el.y && (dragTarget.y + height) <= (el.y + height)))))  {
          const dY = dragTarget.y - el.y
          if (dY < 30 && dY > -20) {
            dragTarget.x = el.x - (width + 1) - ((width + 1) * right);
            right += 1;
          } else if (dY > 30) {
            dragTarget.y = el.y + (height + 1) + ((height + 1) * top);
            top += 1; 
          } else if (dY < 0) {
            dragTarget.y = el.y - (height + 1) + ((height + 1) * bottom);
            bottom += 1;
          }
          checked = false;
        }
      }
    })
    if (!checked) {
      checkPosition();
    } else {
      right = 0;
      left = 0;
      top = 0;
      bottom = 0;
    }
  }

  const handleMouseOut = e => {
    handleMouseUp(e);
  }

  const handleDoubleClick = e => {
    const color = randColor();
    const rect = canvas.current.getBoundingClientRect()
    const mouseX = parseInt(e.clientX - rect.left);
    const mouseY = parseInt(e.clientY - rect.top);
    let newRect = { id: rectang.length, x: mouseX-width/2, y: mouseY-height/2, color: color, connect: [] }
    let borders = false;
    rectang.forEach(el => {
      if (newRect.x >= el.x && newRect.x <= (el.x + width) && newRect.y >= el.y && newRect.y <= (el.y + height)) {
        borders = true;
      } else if (((newRect.x >= el.x && newRect.x <= (el.x + width)) || ((newRect.x + width) >= el.x && (newRect.x + 100) <= (el.x + 100))) && 
      ((newRect.y >= el.y && newRect.y <= (el.y + 50)) || ((newRect.y + 50) >= el.y && (newRect.y + 50) <= (el.y + 50)))) {
        borders = true;
      }
    })
    if (newRect.x < 0 || newRect.y < 0 || borders) {
      return;
    }
    setRectang([...rectang, newRect]);
  }

  const handleClick = (e) => {
    e.preventDefault();
    const rect = canvas.current.getBoundingClientRect()
    const x = parseInt(e.clientX - rect.left);
    const y = parseInt(e.clientY - rect.top);
    for (let i = 0; i < rectang.length; i++) {
      const box = rectang[i];
      if (x >= box.x && x <= box.x + width && y >= box.y && y <= box.y + height) {
        connectRect.push(box.id)
        break;
      }
    }
    if (connectRect.length === 2) {
      setRectang(rectang.map(el => {
        let newa = [];
        if (el.id === connectRect[0] || el.id === connectRect[1]) {
          let checkConnect = false;
          el.connect.map((con, i) => {
            const reverseArr = JSON.parse(JSON.stringify(connectRect))
            if (JSON.stringify(con) === JSON.stringify(connectRect) || JSON.stringify(con) === JSON.stringify(reverseArr.reverse())) {
              checkConnect = true;
              newa = el.connect.filter((_, ind) => i !== ind);
            }
          })
          if (!checkConnect) {
            return {...el, "connect": [...el.connect, [connectRect[0], connectRect[1]]]}
          } else {
            return {...el, "connect": newa}
          }
        } else {
          return el;
        }
      })
      )
      connectRect.length = 0
      draw();
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

