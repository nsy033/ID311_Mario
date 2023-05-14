import star from '../data/images/star.png';
import starblock from '../data/images/starblock.png';

import { Subject } from '../src/Subject';
import { calcCoordinates, collisionTest, ij2xy } from './utilities';

class Star extends Subject {
  constructor(i, j, dir) {
    super(i, j, dir);
    this.img = loadImage(star);

    const [x, y] = ij2xy(this.i, this.j);
    // coordinates of four corners of itself as a rectangle in the canvas
    this.coordinates = calcCoordinates(x, y, false);
  }

  update(source, ...args) {
    // detect collision, and notify the cause provider that the collision happens with whom
    // as this is a star-related-object, if it collides with Mario, then also notify the succeed
    if (source == 'mario-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('star-collides-succeed', this.coordinates);
      }
    } else if (source == 'mario-follows-gravity') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('star-holds-succeed', this.coordinates);
      }
    } else if (source == 'fire-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('star-change-fire-dir', args[1], args[2]);
      }
    }
  }
}

class StarBlock extends Subject {
  constructor(i, j, dir) {
    super(i, j, dir);
    this.img = loadImage(starblock);

    const [x, y] = ij2xy(this.i, this.j);
    // coordinates of four corners of itself as a rectangle in the canvas
    this.coordinates = calcCoordinates(x, y, false);
  }

  update(source, ...args) {
    // detect collision, and notify the cause provider that the collision happens with whom
    // as this is a star-related-object, if it collides with Mario, then also notify the succeed
    if (source == 'mario-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('starblock-collides-succeed', this.coordinates);
      }
    } else if (source == 'mario-follows-gravity') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('starblock-holds-succeed', this.coordinates);
      }
    } else if (source == 'fire-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('starblock-change-fire-dir', args[1], args[2]);
      }
    }
  }
}

export { Star, StarBlock };
