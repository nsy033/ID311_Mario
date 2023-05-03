// Assets
import fire from '../data/fire.png';
import thorn from '../data/thorn.png';
import { Environment } from '../src/Environment';

/*
    0: up
    1: left
    2: down
    3: right
    */

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
