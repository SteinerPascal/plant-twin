import React, { useRef, useEffect } from "react";
import CircularFAB from "./CircularFAB";



import "./menu.scss";
//https://codesandbox.io/s/circles-forked-wl8j87?file=/src/App.js

export default function CircularMenu() {
  const graph = useRef<HTMLDivElement>(null);
  const insertChildren = ()=>{

  }

  const styleChildren = (cyclegraph:HTMLDivElement,circleElements:HTMLCollection)=>{
    let angle = 360 - 90;
    let dangle = 360 / circleElements.length;

    for (let i = 0; i < circleElements.length; i++) {
      let circle = circleElements[i] as HTMLElement;
      angle += dangle;
      circle.style.transform = `rotate(${angle}deg) translate(${cyclegraph.clientWidth /
        1.9}px) rotate(-${angle}deg)`;
    }
  }
  useEffect(() => {
    const cyclegraph = graph.current;
    if(!cyclegraph) throw Error('cyclegraph element not found')
    const circleElements = cyclegraph.children;
    styleChildren(cyclegraph,circleElements)
  }, []);

  return (
    <div className="App">
      <div className="cyclegraph" ref={graph}>
      <div className="circle">
        <CircularFAB ></CircularFAB>
      </div>
      <div className="circle">
        <CircularFAB ></CircularFAB>
      </div>
      <div className="circle">
        <CircularFAB ></CircularFAB>
      </div>
      <div className="circle">
        <CircularFAB ></CircularFAB>
      </div>
      <div className="circle">
        <CircularFAB ></CircularFAB>
      </div>
      <div className="circle">
        <CircularFAB ></CircularFAB>
      </div>
      </div>
    </div>
  );
}