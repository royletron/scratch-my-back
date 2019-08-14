import back from "./assets/tback.png";

const imageCache = {};

const loadImage = (key, t) => {
  if (imageCache[key]) {
    return imageCache[key];
  } else {
    imageCache[key] = new Image();
    imageCache[key].src = t;
    imageCache[key].setAttribute("crossOrigin", "");
    return imageCache[key];
  }
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
    this.back = new OffscreenCanvas(16 * 10, 24 * 10);
    this.ctx = this.back.getContext("2d");
    let image = loadImage("back", back);
    this.ctx.drawImage(image, 0, 0, image.width * 10, image.height * 10);
    this.image = this.ctx.getImageData(0, 0, this.back.width, this.back.height);
  }
  draw(ctx) {
    ctx.putImageData(this.image, 0, 0);
  }
}

class Game {
  constructor(id) {
    this.running = true;
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
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
