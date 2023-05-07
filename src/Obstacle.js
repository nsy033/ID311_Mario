// Assets
import fire from '../data/images/fire.png';
import thorn from '../data/images/thorn.png';
import { Subject } from '../src/Subject';
import {
  DIRECTION,
  THORN_MARGIN,
  TILE_SIZE,
  FIRE_STEP,
  STATUS,
} from './Constants';
import { GameManager } from './GameManager';
import { calcCoordinates, collisionTest, ij2xy } from './utilities';

class Fire extends Subject {
  constructor(i, j, dir) {
    super(i, j, dir);
    this.img = loadImage(fire);

    const [x, y] = ij2xy(this.i, this.j);
    this.x = x;
    this.y = y;
    this.coordinates = calcCoordinates(x, y, false);
  }

  draw() {
    if (this.dir == 0) image(this.img, this.x, this.y, TILE_SIZE, TILE_SIZE);
    else {
      translate(this.x, this.y);

      let angle = -90;
      if (this.dir == 2) {
        angle = 180;
      } else if (this.dir == 3) {
        angle = 90;
      }

      rotate(angle);
      image(this.img, 0, 0, TILE_SIZE, TILE_SIZE);
    }
    resetMatrix();

    if (GameManager.getInstance().getStatus() == STATUS.gameover) return;

    if (this.dir == DIRECTION.up) this.y -= FIRE_STEP;
    else if (this.dir == DIRECTION.down) this.y += FIRE_STEP;
    else if (this.dir == DIRECTION.left) this.x -= FIRE_STEP;
    else if (this.dir == DIRECTION.right) this.x += FIRE_STEP;

    this.coordinates = calcCoordinates(this.x, this.y, false);
    this.notifySubscribers(
      'fire-wants-to-move',
      this.coordinates,
      this.i,
      this.j
    );
  }

  update(source, ...args) {
    if (source == 'mario-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('fire-collides-gameover', this.coordinates);
      }
    } else if (source == 'mario-follows-gravity') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('fire-holds-gameover', this.coordinates);
      }
    } else if (source.includes('change-fire-dir')) {
      if (!(args[0] == this.i && args[1] == this.j)) return;

      if (this.dir == DIRECTION.up) this.y += FIRE_STEP;
      else if (this.dir == DIRECTION.down) this.y -= FIRE_STEP;
      else if (this.dir == DIRECTION.left) this.x += FIRE_STEP;
      else if (this.dir == DIRECTION.right) this.x -= FIRE_STEP;
      this.dir = (this.dir + 2) % 4;
    }
  }
}

class Thorn extends Subject {
  constructor(i, j, dir) {
    super(i, j, dir);
    this.img = loadImage(thorn);

    const [x, y] = ij2xy(this.i, this.j);
    this.coordinates = calcCoordinates(x, y, false);

    if (this.dir == DIRECTION.up) {
      this.coordinates.upperLeft.y += THORN_MARGIN;
      this.coordinates.upperRight.y += THORN_MARGIN;
    } else if (this.dir == DIRECTION.left) {
      this.coordinates.upperLeft.x += THORN_MARGIN;
      this.coordinates.lowerLeft.x += THORN_MARGIN;
    } else if (this.dir == DIRECTION.down) {
      this.coordinates.lowerLeft.y -= THORN_MARGIN;
      this.coordinates.lowerRight.y -= THORN_MARGIN;
    } else if (this.dir == DIRECTION.right) {
      this.coordinates.upperRight.x -= THORN_MARGIN;
      this.coordinates.lowerRight.x -= THORN_MARGIN;
    }
  }

  update(source, ...args) {
    if (source == 'mario-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('thorn-collides-gameover', this.coordinates);
      }
    } else if (source == 'mario-follows-gravity') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('thorn-holds-gameover', this.coordinates);
      }
    } else if (source == 'fire-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('thorn-change-fire-dir', args[1], args[2]);
      }
    }
  }
}

export { Fire, Thorn };
