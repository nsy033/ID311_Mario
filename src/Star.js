// Assets
import star from '../data/star.png';
import starblock from '../data/starblock.png';
import { Environment } from '../src/Environment';

class Star extends Environment {
  constructor(i, j, dir) {
    super(i, j, dir);
    this.img = loadImage(star);
  }
}

class StarBlock extends Environment {
  constructor(i, j, dir) {
    super(i, j, dir);
    this.img = loadImage(starblock);
  }
}

export { Star, StarBlock };
