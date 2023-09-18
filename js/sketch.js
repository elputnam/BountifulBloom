//Failure to Load: an alley of lions

//photos
let base;
let blender;
let shadows = [];
let Laurels = [];
let Laurel;
let LaurelLion1;
let LaurelLion2;
let lion;
let lion1;
let lion2;
let stone;

let alp1 = 0;
let alp2 = 100;
//let tileCount = 20;
let hue = 180;

// Tiles configuration
let tiles = [];
let cols = 10;
let rows = 10;
let w, h;

// Order of tiles
let board = [];

//CCapture
// var capture = false; // default is to not capture frames, can be changed with button in browser
var capturer = new CCapture({
  format:'webm', 
  workersPath: 'js/',
  framerate: 7
});

function preload(){
  base = loadImage('assets/BountifulBloom_base.png');
  blender = loadImage('assets/BountifulBloom_blender.png');
  Laurel = loadImage('assets/BountifulBloom_Laurel.png');
  LaurelLion1 = loadImage('assets/BountifulBloom_LaurelLion1.png');
  LaurelLion2 = loadImage('assets/BountifulBloom_LaurelLion2.png');
  lion = loadImage('assets/BountifulBloom_lion.png');
  lion1 = loadImage('assets/BountifulBloom_lion1.png');
  lion2 = loadImage('assets/BountifulBloom_lion2.png');
  stone = loadImage('assets/BountifulBloom_tiles.png')
  for (let i = 0; i < 4; i++){
    Laurels[i] = loadImage('assets/BountifulBloom_Laurel' + i + '.png');
  }

}

function setup() {
  createCanvas(base.width, base.height);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
  frameRate(7);

  //Array of Shadows
  for (let k = 0; k < Laurels.length; k++){
    let images = new Shadow(random(width*.4), random(height*.5), random(20,30), random(10,20), 255, Laurels[k]);
    shadows.push(images);
  }

  // pixel dimensions of each tiles
  w = width / cols;
  h = height / rows;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * h;
      let img = createImage(w, h);
      img.copy(stone, x, y, w, h, 0, 0, w, h);
      let index = i + j * cols;
      board.push(index);
      let tile = new Tile(index, img);
      tiles.push(tile);
    }
  }
}

function draw() {
  if (frameCount==1) capturer.start();
  background(random(360), 100, 100);
  //tileCount = random(20);

  //base
  push();
  tint(255, random(70,100));
  image(base, 0, 0);
  pop();

  //blender
  blend(blender, 0, 0, blender.width, blender.height, 0, 0, width, height, DIFFERENCE);

  //lions
  blend(lion, 0, 0, lion.width, lion.height, 0, 0, lion.width, lion.height, LIGHTEST);
  push();
  scale(-1, 1);
  blend(lion, 0, 0, lion.width, lion.height, - width, 0, lion.width, lion.height, LIGHTEST);
  pop();

 //Laurels
 for (let j = 0; j < shadows.length; j++){
  shadows[j].edges();
  shadows[j].move();
  shadows[j].show();
}

  //lions
  image(lion1, 0, 0);
  image(lion2, 0, 0);

  //tile shuffle
  push();
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let index = int(random(100));
      let x = i * w;
      let y = j * h;
      let tileIndex = board[index];
      if (tileIndex > -1) {
        tint(random(255), alp1);
        let img = tiles
        [tileIndex].img;
        img.filter(INVERT);
        image(img, x, y, w, h);
      }
    }
  }
  pop();

  //dancing
  let p = int(random(0,4));
  //sil[p].filter(INVERT);
  for (let j = 0; j < 10; j++){
    push();
    tint(random(180,360), 100, 100, random(alp1-50, alp1));
    image(lion1, random(-200, width), 0);
    image(lion2, random(-width,width), -400);
    image(lion1, random(-200, width), -600);
    pop();
  }
  
  //Laurel Lions

  blend(LaurelLion1, 0, 0, LaurelLion1.width, LaurelLion1.height, 0, 0, width, height, DIFFERENCE);
  push();
  tint(0, random(alp2));
  image(LaurelLion1, random(-10,10), random(-10,10));
  pop();

  blend(LaurelLion2, 0, 0, LaurelLion2.width, LaurelLion2.height, 0, 0, width, height, DIFFERENCE);
  push();
  tint(0, random(alp2));
  image(LaurelLion2, random(-10,10), random(-10,10));
  pop();


  //Laurel
  push();
  tint(255, random(alp2));
  image(Laurel, 70 - random(-20,20), height-Laurel.height +random(-10,10))
  pop();
  blend(Laurel, 0, 0, Laurel.width, Laurel.height, 70, height-Laurel.height, Laurel.width, Laurel.height, EXCLUSION);

  //scene shift
  if (frameCount%int(random(20))==0){
    lion1.filter(INVERT);
    lion2.filter(INVERT);
    if (alp1 == 0){
      alp1 = 100;
      alp2 = 0;
    } else {
      alp1 = 0;
      alp2 = 100;
    }
  }
  capturer.capture(document.getElementById('defaultCanvas0'));  
    if (frameCount==2100){
      save_record();
    }
    print(frameCount);
  
  
}

class Shadow{
  constructor(x, y, xInc, yInc, tint1, LaurelImg){
    this.x = x;
    this.y = y;
    this.xInc = xInc;
    this.yInc = yInc;
    this.tint = tint1;
    this.Laurel = LaurelImg;
  }
  edges(){
    if (this.x <= 0 || this.x >= width - this.Laurel.width){
      this.xInc *= -1;
      if (this.tint == 255){
        this.tint = 0;
      } else {
        this.tint = 255;
      }
    }
    if (this.y <= 0 || this.y >= height - this.Laurel.height){
      this.yInc *= -1;
      if (this.tint == 255){
        this.tint = 0;
      } else {
        this.tint = 255;
      }
    }
  }
  move(){
    this.x += this.xInc;
    this.y += this.yInc;
  }
  show(){
    push();
    tint(this.tint, random(alp2-50, alp2-30));
    image(this.Laurel, this.x + random(-20,20), this.y + random(-20,20));
    blend(this.Laurel, 0, 0, this.Laurel.width, this.Laurel.height, this.x, this.y, this.Laurel.width, this.Laurel.height, EXCLUSION);
    pop();
  }
}

class Tile {
  constructor(i, img) {
    this.index = i;
    this.img = img;    
  }
}

function save_record() {
  capturer.save();
}

