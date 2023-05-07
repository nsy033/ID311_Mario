// Assets
import star from '../data/star.png';
import starblock from '../data/starblock.png';
import { Subject } from '../src/Subject';
import { calcCoordinates, collisionTest, ij2xy } from './utilities';

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
        this.notifySubscribers('star-collides-succeed', this.coordinates);
      }
    } else if (source == 'mario-follows-gravity') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('star-holds-succeed', this.coordinates);
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
        this.notifySubscribers('starblock-collides-succeed', this.coordinates);
      }
    } else if (source == 'mario-follows-gravity') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('starblock-holds-succeed', this.coordinates);
      }
    }
  }
}

export { Star, StarBlock };
