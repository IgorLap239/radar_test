import React, {useEffect, useState} from 'react';
import { CanvasElement } from './components/CanvasElement';
import './App.css'

const App = () => {
  /*const [dimensions, setDimensions] = React.useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  })
  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }
    window.addEventListener('resize', handleResize)
    return _ => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])*/

  return (
    <div className="app">
      <div className="instruction">
        <h2 className="instruction-title">Instruction</h2>
        <p className="instruction-elem"><span>To create a new rectangle:</span> doubleclick</p>
        <p className="instruction-elem"><span>To move a rectangle inside a layer:</span> hold down the left mouse button on the rectangle and move</p>
        <p className="instruction-elem"><span>To create a new connection between two rectangles:</span> right click for each</p>
        <p className="instruction-elem"><span>To delete connection between two rectangles:</span> right click for each</p>
      </div>
      <CanvasElement/>
    </div>
  );
}

export { App };

