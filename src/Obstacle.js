// Assets
import fire from '../data/fire.png';
import thorn from '../data/thorn.png';
import { Subject } from '../src/Subject';
import { HALF_TILE_SIZE, MARIO_MARGIN_LR, THORN_MARGIN } from './Constants';
import { calcCoordinates, collisionTest, ij2xy, xy2ij } from './utilities';

/*
    0: up
    1: left
    2: down
    3: right
    */

class Fire extends Subject {
  constructor(i, j, dir) {
    super(i, j, dir);
    this.img = loadImage(fire);

    const [x, y] = ij2xy(this.i, this.j);
    this.coordinates = calcCoordinates(x, y, false);
  }

  update(source, ...args) {
    if (source == 'mario-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('fire-collides', this.coordinates);
        return;
      }
    } else if (source == 'mario-follows-gravity') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('fire-holds', this.coordinates);
        return;
      }
    }
  }
}

class Thorn extends Subject {
  constructor(i, j, dir) {
    super(i, j, dir);
    this.img = loadImage(thorn);

    const [x, y] = ij2xy(this.i, this.j);
    this.coordinates = calcCoordinates(x, y, false);

    /*
    0: up
    1: left
    2: down
    3: right
    */
    if (this.dir == 0) {
      this.coordinates.upperLeft.y += THORN_MARGIN;
      this.coordinates.upperRight.y += THORN_MARGIN;
    } else if (this.dir == 1) {
      this.coordinates.upperLeft.x += THORN_MARGIN;
      this.coordinates.lowerLeft.x += THORN_MARGIN;
    } else if (this.dir == 2) {
      this.coordinates.lowerLeft.y -= THORN_MARGIN;
      this.coordinates.lowerRight.y -= THORN_MARGIN;
    } else if (this.dir == 3) {
      this.coordinates.upperRight.x -= THORN_MARGIN;
      this.coordinates.lowerRight.x -= THORN_MARGIN;
    }
  }

  update(source, ...args) {
    if (source == 'mario-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('thorn-collides', this.coordinates);
        return;
      }
    } else if (source == 'mario-follows-gravity') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('fire-holds', this.coordinates);
        return;
      }
    }
  }
}

export { Fire, Thorn };
