import back from "./assets/tback.png";

const imageCache = {};

const loadImage = (key, t) => {
  if (imageCache[key]) {
    return imageCache[key];
  } else {
    imageCache[key] = new Image();
    imageCache[key].src = t;
    return imageCache[key];
  }
};

class Game {
  constructor(id) {
    this.running = true;
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
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
    this.ctx.drawImage(loadImage("back", back), 10, 10);
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
