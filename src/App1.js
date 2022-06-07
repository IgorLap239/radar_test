import './App.css';
import React, { useState } from 'react';
import { useRef } from 'react';
import useDoubleClick from 'use-double-click';
//import { createRoot } from 'react-dom/client';
import { Stage, Layer, Rect, Shape } from 'react-konva';

function App() {
  const buttonRef = useRef();
  const [state, setState] = useState({
    isDragging: false,
    x: 50,
    y: 50,
  })

  const testEvent = (e) => {
    console.log('target = ', e.target);
	  let x = e.offsetX;
	  let y = e.offsetY;
    console.log('point = ', `${x}: ${y}`)
  }
  
  return (
    <Stage width={window.innerWidth} height={window.innerHeight} onClick={(e)=>testEvent(e)}>
      <Layer>
        <Rect
          width={100}
          height={100}
          fill="#00D2FF"
          stroke="black"
          strokeWidth={4}
          x={state.x}
          y={state.y}
          draggable
          onDragStart={() => {
            setState({
              isDragging: true,
            });
          }}
          onDragEnd={(e) => {
            setState({
              isDragging: false,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
        />
      </Layer>
    </Stage>
  );
}

export default App;
