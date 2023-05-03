// Assets
import fire from '../data/fire.png';
import thorn from '../data/thorn.png';
import { Environment } from '../src/Environment';

class Fire extends Environment {
  constructor(i, j, dir) {
    super(i, j, dir);
    this.img = loadImage(fire);
  }
}

class Thorn extends Environment {
  constructor(i, j, dir) {
    super(i, j, dir);
    this.img = loadImage(thorn);
  }
}

export { Fire, Thorn };
