// Assets
import block from '../data/images/block.png';
import grass from '../data/images/grass.png';
import { Subject } from '../src/Subject';
import { calcCoordinates, collisionTest, ij2xy } from './utilities';

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
      }
    } else if (source == 'mario-follows-gravity') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('block-holds', this.coordinates);
      }
    } else if (source == 'fire-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('block-change-fire-dir', args[1], args[2]);
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
      }
    } else if (source == 'mario-follows-gravity') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('grass-holds', this.coordinates);
      }
    } else if (source == 'fire-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('grass-change-fire-dir', args[1], args[2]);
      }
    }
  }
}

export { Block, Grass };
