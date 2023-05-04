// Assets
import block from '../data/block.png';
import grass from '../data/grass.png';
import { Subject } from '../src/Subject';
import { HALF_TILE_SIZE, MARIO_MARGIN } from './Constants';
import { calcCoordinates, collisionTest, ij2xy, xy2ij } from './utilities';

class Block extends Subject {
  constructor(i, j, dir) {
    super(i, j, dir);
    this.img = loadImage(block);

    const [x, y] = ij2xy(this.i, this.j);
    this.coordinates = calcCoordinates(x, y, false);
  }

  update(source, ...args) {
    if (source == 'mario-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('block-collides', this.coordinates);
        return;
      }
    } else if (source == 'mario-follows-gravity') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('block-holds', this.coordinates);
        return;
      }
    }
  }
}

class Grass extends Subject {
  constructor(i, j, dir) {
    super(i, j, dir);
    this.img = loadImage(grass);

    const [x, y] = ij2xy(this.i, this.j);
    this.coordinates = calcCoordinates(x, y, false);
  }

  update(source, ...args) {
    if (source == 'mario-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('grass-collides', this.coordinates);
        return;
      }
    } else if (source == 'mario-follows-gravity') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('grass-holds', this.coordinates);
        return;
      }
    }
  }
}

export { Block, Grass };
