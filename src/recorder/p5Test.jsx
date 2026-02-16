import React from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import { useEffect, useState, useRef } from "react";
let all_dgts = [
  0x7e, 0x30, 0x6d, 0x79, 0x33, 0x5b, 0x5f, 0x72, 0x7f, 0x7b, 0x00,
];
let odd_dgts = [0x30, 0x79, 0x5b, 0x72, 0x7b, 0x00];
let even_dgts = [0x7e, 0x6d, 0x33, 0x5f, 0x7f, 0x00];
let index = 0;

let elBuf1 = { elDoorWidth: 0 };
let elBuf2 = { elDoorWidth: 0 };

function sketch(p5) {
  let number = 0;

  let size = {
    w: 100,
    h: 100,
  };

  p5.updateWithProps = (props) => {
    if (props.value !== undefined) {
      number = props.value;
      size = props.size;

      p5.resizeCanvas(size.w, size.h);
    }
  };

  p5.setup = () => {
    p5.createCanvas(size.w, size.h);
    p5.frameRate(30);
  };

  p5.draw = () => {
    p5.background(0);

    p5.push();
    p5.scale(size.h / 600);
    p5.translate(20, 20);
    sevenSegment(p5, all_dgts[number]);
    p5.pop();

    //-------------------
    p5.push();
    p5.translate(100, 50);
    p5.scale(0.3);
    Elevator(p5, number % 3 == 0, elBuf1);
    p5.pop();

    //-------------------

    p5.push();
    p5.translate(300, 50);
    p5.scale(0.3);
    Elevator(p5, number % 2 == 0, elBuf2);
    p5.pop();
  };
}

export function P5Test() {
  const [time, setTime] = useState(0);
  const [size, setSize] = useState({ w: 300, h: 150 });
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((t) => (t + 1) % 10);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setSize({ w: clientWidth, h: clientHeight });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "300px" }}>
      <ReactP5Wrapper sketch={sketch} value={time} size={size} />
    </div>
  );
}

//change color from here
function getColor(p, val, shift) {
  let r = 0;
  let g = 100;
  let b = 255;
  let a = 40 + 255 * ((val >> shift) & 1);
  return p.color(r, g, b, a);
}
//configuration
function sevenSegment(p, val) {
  let val_1 = 78,
    val_2 = 18,
    val_3 = 98;
  p.push();
  p.noStroke();
  p.noFill();

  p.fill(getColor(p, val, 6));
  p.rect(60, 20, val_1, val_2, 10, 10); //A

  p.fill(getColor(p, val, 5));
  p.rect(140, 40, val_2, val_3, 10, 10); //B

  p.fill(getColor(p, val, 4));
  p.rect(140, 160, val_2, val_3, 10, 10); //C

  p.fill(getColor(p, val, 3));
  p.rect(60, 260, val_1, val_2, 10, 10); //D

  p.fill(getColor(p, val, 2));
  p.rect(40, 160, val_2, val_3, 10, 10); //E

  p.fill(getColor(p, val, 1));
  p.rect(40, 40, val_2, val_3, 10, 10); //F

  p.fill(getColor(p, val, 0));
  p.rect(60, 140, val_1, val_2, 10, 10); //G
  p.pop();
}

function Elevator(p, doorOpen, buff) {
  p.fill(255);
  p.stroke(0);

  //p.background(r, g, b);
  //Outer box of elevator
  p.fill(0);
  p.stroke(255);
  p.rect(190, 40, 220, 320);
  p.stroke(0);

  p.noFill();
  p.stroke(255);
  p.line(0, 360, 600, 360);
  //Elevator controls
  p.fill(0);
  p.rect(430, 190, 20, 40);
  p.fill(255);
  p.ellipse(440, 200, 10, 10);
  p.ellipse(440, 220, 10, 10);
  //Bar on elevator
  p.rect(260, 20, 80, 10);
  p.fill(0);
  p.rect(280, 20, 40, 10);
  p.stroke(0);

  p.fill(200);
  p.rect(200, 50, 200, 300);
  p.line(200, 50, 240, 80);
  p.line(240, 80, 240, 300);
  p.line(240, 300, 200, 350);
  p.line(240, 80, 360, 80);
  p.line(360, 80, 400, 50);
  p.line(360, 80, 360, 300);
  p.line(240, 300, 360, 300);
  p.line(360, 300, 400, 350);

  if (!doorOpen) {
    p.fill("rgb(21, 175, 236)");
    p.rect(400 - buff.elDoorWidth, 50, buff.elDoorWidth, 300);
    p.rect(200, 50, buff.elDoorWidth, 300);
    if (buff.elDoorWidth < 100) buff.elDoorWidth++;
  } else {
    p.fill("rgb(21, 175, 236)");
    p.rect(400 - buff.elDoorWidth, 50, buff.elDoorWidth, 300);
    p.rect(200, 50, buff.elDoorWidth, 300);

    if (buff.elDoorWidth > 0) buff.elDoorWidth -= 1;
  }
}

/*
  if (mouseIsPressed) {
    print(mouseX, mouseY);
  }

function keyReleased() {
  //Press 1 
  if (keyCode == 49 && !ding.isPlaying()) {
    ding.play();
  }
  //Press 2
  else if (keyCode == 50 && !banana.isPlaying() ) {
    banana.play();
  }
  //Press 3
  else if (keyCode == 51 && !drum.isPlaying()) {
    balloon = new Balloon();
    drum.play();
  } 
  //Press 4
  else if (keyCode == 52 && !bells.isPlaying()) {
    bells.play();
  }
}

var ding;
var banana;
var tears; 
var takerimba; 
var balloon;
var r;
var g; 
var b;
var currentTime;
var nextTimeChange;

function preload(){
  elevator = loadSound('sounds/elevatormusic.mp3');
  ding = loadSound('sounds/elevatording.wav');
  banana = loadSound('sounds/banana-shaker.mp3');
  drum = loadSound('sounds/snare-drum.mp3');
  bells = loadSound('sounds/agogobells.mp3');
}

function setup() {
  createCanvas(600, 400);
  elevator.loop();
  elevator.setVolume(0.7);
  balloon = new Balloon();
  nextTimeChange = millis();
}
class Balloon {
  constructor() {
    this.x1 = random(width);
    this.x2 = random(width);
    this.x3 = random(width);
    this.y1 = height;
    this.y2 = height;
    this.y3 = height;
    this.d1 = 50;
    this.d2 = 50;
    this.speed1 = 2.5;
    this.speed2 = 2.7;
    this.speed3 = 3.2;
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }

  move() {
    this.y1 -= this.speed1;
    this.y2 -= this.speed2;
    this.y3 -= this.speed3;
  }

  display(){
    stroke(125);
    fill(this.r,0,this.b);
    ellipse(this.x1, this.y1, 50, 60);
    line(this.x1, this.y1+30, this.x1, this.y1+150);
    fill(this.r,this.g,0);
    ellipse(this.x2, this.y2, 50, 60);
    line(this.x2, this.y2+30, this.x2, this.y2+150);
    fill(0,this.g,this.b);
    ellipse(this.x3, this.y3, 50, 60);
    line(this.x3, this.y3+30, this.x3, this.y3+150);
  }
}

*/
