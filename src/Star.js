// Assets
import star from '../data/star.png';
import starblock from '../data/starblock.png';
import { Subject } from '../src/Subject';
import { HALF_TILE_SIZE } from './Constants';
import { calcCoordinates, collisionTest, ij2xy, xy2ij } from './utilities';

class Star extends Subject {
  constructor(i, j, dir) {
    super(i, j, dir);
    this.img = loadImage(star);

    const [x, y] = ij2xy(this.i, this.j);
    this.coordinates = calcCoordinates(x, y, false);
  }

  update(source, ...args) {
    if (source == 'mario-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('star-collides', this.coordinates);
        return;
      }
    }
  }
}

class StarBlock extends Subject {
  constructor(i, j, dir) {
    super(i, j, dir);
    this.img = loadImage(starblock);

    const [x, y] = ij2xy(this.i, this.j);
    this.coordinates = calcCoordinates(x, y, false);
  }

  update(source, ...args) {
    if (source == 'mario-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('starblock-collides', this.coordinates);
        return;
      }
    }
  }
}

export { Star, StarBlock };
