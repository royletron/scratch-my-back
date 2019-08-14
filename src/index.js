import back from "./assets/tback.png";

const imageCache = {};

const getImage = key => {
  return imageCache[key].img;
};

const loadImages = (arr, oncomplete) => {
  const onload = k => {
    imageCache[k].loaded = true;
    if (
      Object.keys(imageCache).find(k => imageCache[k].loaded === false) ===
      undefined
    ) {
      oncomplete();
    }
  };
  arr.forEach(([k, t]) => {
    let img = new Image();
    img.src = t;
    img.onload = () => onload(k);
    img.setAttribute("crossOrigin", "");
    imageCache[k] = { img, loaded: false };
  });
};

const names = {
  f: ["Sarah", "Lily", "Kiki", "Rosie"],
  m: [
    "Dave",
    "Brian",
    "Simon",
    "Vlasto",
    "James",
    "Ed",
    "Adam",
    "Toby",
    "Felix"
  ]
};

const skins = [
  "#ffe0bd",
  "#ffcd94",
  "#eac086",
  "#ffad60",
  "#ffe39f",
  "#8d5524"
];

class Worker {
  constructor() {
    this.gender = Math.random() > 0.5 ? "m" : "f";
    this.name =
      names[this.gender][Math.floor(Math.random() * names[this.gender].length)];
    this.skin = skins[Math.floor(Math.random() * skins.length)];
    this.back = new OffscreenCanvas(16, 24);
    this.ctx = this.back.getContext("2d");
    let image = getImage("back");
    console.log(image);
    this.ctx.drawImage(image, 0, 0, image.width, image.height);
    this.image = this.ctx.getImageData(0, 0, 16, 24);
    console.log(this.image);
  }
  draw(ctx) {
    ctx.putImageData(this.image, 0, 0);
  }
}

class Game {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    loadImages([["back", back]], () => this.onLoad());
  }
  onLoad() {
    this.running = true;
    this.members = [new Worker()];
    this.loop();
  }
  loop() {
    if (this.running) {
      window.requestAnimationFrame(() => this.loop());
      let dt = 0;
      let time = Date.now();
      if (this.previousTime) {
        dt = time - this.previousTime;
      }
      if (dt > 200) {
        //something has gone terribly wrong
        dt = 20;
      }
      this.previousTime = time;
      this.update(dt);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.draw();
    }
  }
  update() {}
  draw() {
    this.ctx.fillStyle = "#0000ff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.members.forEach(m => m.draw(this.ctx));
  }
  destroy() {
    this.running = false;
  }
}

let game = new Game("canvas");

if (process.env.NODE_ENV === "development") {
  if (module.hot) {
    module.hot.dispose(function() {
      // module is about to be replaced
      game.destroy();
    });

    module.hot.accept(function() {
      // module or one of its dependencies was just updated
      console.log("Updated");
    });
  }
}
