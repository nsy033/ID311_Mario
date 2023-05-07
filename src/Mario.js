import {
  TILE_SIZE,
  MARIO_STEP,
  GRAVITY_STEP,
  DIRECTION,
  STATUS,
} from '../src/Constants';
import mario_float from '../data/mario-float.png';
import mario_stable from '../data/mario-stable.png';
import mario_walk from '../data/mario-walk.png';
import mario_hurt from '../data/mario-hurt.png';
import { Subject } from './Subject';
import { calcCoordinates, ij2xy, xy2ij } from './utilities';
import { GameManager } from './GameManager';

class Mario extends Subject {
  constructor() {
    super();

    this.float_img = loadImage(mario_float);
    this.stable_img = loadImage(mario_stable);
    this.walk_img = loadImage(mario_walk);
    this.hurt_img = loadImage(mario_hurt);
    this.img2display = 1;
    this.gravityCache = new Set();

    this.dir = DIRECTION.down;
  }

  static getInstance() {
    if (!this._instance) this._instance = new Mario();
    return this._instance;
  }

  setPosition(i, j, dir, face) {
    const [x, y] = ij2xy(i, j);
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.face = face;

    this.coordinates = calcCoordinates(x, y, true);
  }

  getPosition() {
    return { x: this.x, y: this.y, dir: this.dir, face: this.face };
  }

  setDirection(dir) {
    this.dir = dir;
  }

  getDirection() {
    return this.dir;
  }

  draw() {
    const img =
      this.img2display == 0
        ? this.float_img
        : this.img2display == 1
        ? this.stable_img
        : this.img2display == 2
        ? this.walk_img
        : this.hurt_img;

    translate(this.x, this.y);

    if (this.dir == 2) {
      if (this.face == -1) scale(-1, 1);
    } else {
      let angle = -90;
      if (this.dir == 0) {
        if (this.face == 1) scale(-1, 1);
        angle = 180;
      } else if (this.dir == 1) {
        angle = 90;
      } else {
        angle = 270;
      }

      rotate(angle);
    }
    image(img, 0, 0, TILE_SIZE, TILE_SIZE);

    resetMatrix();
  }

  move(face) {
    this.face = face;
    this.x += MARIO_STEP * this.face;

    this.coordinates = calcCoordinates(this.x, this.y, true);
    this.notifySubscribers('mario-wants-to-move', this.coordinates);

    if (GameManager.getInstance().getStatus() != STATUS.alive) return;

    this.img2display++;
    if (this.img2display > 2) this.img2display = 1;
  }

  recieveGravity() {
    this.gravityCache.clear();
    this.img2display = 0;

    if (this.dir == 2) this.y += GRAVITY_STEP;
    else if (this.dir == 0) this.y -= GRAVITY_STEP;

    this.coordinates = calcCoordinates(this.x, this.y, true);
    this.notifySubscribers('mario-follows-gravity', this.coordinates);
  }

  standOnSth() {
    return this.gravityCache.size > 0;
  }

  beStable() {
    this.img2display = 1;
  }

  update(source, ...args) {
    if (source.includes('gameover')) {
      this.img2display = 3;
    } else if (source.includes('succeed')) {
      this.img2display = 0;
    } else {
      if (source.includes('collides')) {
        this.x -= MARIO_STEP * this.face;
        this.coordinates = calcCoordinates(this.x, this.y, true);
      } else if (source.includes('holds')) {
        const [i, j] = xy2ij(this.x, this.y);

        if (this.img2display == 0) this.img2display = 1;
        else this.img2display++;

        if (!this.gravityCache.has((i, j))) {
          this.gravityCache.add((i, j));

          if (this.dir == 2) this.y -= GRAVITY_STEP;
          else if (this.dir == 0) this.y += GRAVITY_STEP;
          this.coordinates = calcCoordinates(this.x, this.y, true);
        }
      }
    }
  }
}

export { Mario };
