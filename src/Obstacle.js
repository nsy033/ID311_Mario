// Assets
import fire from '../data/fire.png';
import thorn from '../data/thorn.png';
import { Subject } from '../src/Subject';
import { DIRECTION, THORN_MARGIN } from './Constants';
import { calcCoordinates, collisionTest, ij2xy } from './utilities';

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
        this.notifySubscribers('fire-collides-gameover', this.coordinates);
      }
    } else if (source == 'mario-follows-gravity') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('fire-holds-gameover', this.coordinates);
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
    }
  }
}

export { Fire, Thorn };
