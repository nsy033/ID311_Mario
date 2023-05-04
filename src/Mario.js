import { HALF_TILE_SIZE, TILE_SIZE, MARIO_STEP } from '../src/Constants';
import mario_float from '../data/mario-float.png';
import mario_stable from '../data/mario-stable.png';
import mario_walk from '../data/mario-walk.png';
import mario_hurt from '../data/mario-hurt.png';
import { Subject } from './Subject';

class Mario extends Subject {
  constructor() {
    super();

    this.float_img = loadImage(mario_float);
    this.stable_img = loadImage(mario_stable);
    this.walk_img = loadImage(mario_walk);
    this.hurt_img = loadImage(mario_hurt);
    this.img2display = 1;
  }

  static getInstance() {
    if (!this._instance) this._instance = new Mario();
    return this._instance;
  }

  setPosition(i, j, dir, face) {
    this.x = i * TILE_SIZE + HALF_TILE_SIZE;
    this.y = j * TILE_SIZE + HALF_TILE_SIZE;
    this.dir = dir;
    this.face = face;
  }

  draw() {
    const img =
      this.img2display == 0
        ? this.float_img
        : this.img2display == 1
        ? this.stable_img
        : this.walk_img;

    translate(this.x, this.y);
    if (this.dir == 0) {
      if (this.face == -1) scale(-1, 1);

      image(img, 0, 0, TILE_SIZE, TILE_SIZE);
    } else {
      translate(x, y);

      let angle = -90;
      if (this.dir == 2) {
        angle = 180;
      } else if (this.dir == 3) {
        angle = 90;
      }

      rotate(angle);
      image(img, 0, 0, TILE_SIZE, TILE_SIZE);
    }

    resetMatrix();
  }

  move(face) {
    this.face = face;
    this.x += MARIO_STEP * this.face;
    this.img2display++;
    if (this.img2display > 2) this.img2display = 1;
  }

  beStable() {
    this.img2display = 1;
  }
}

export { Mario };
