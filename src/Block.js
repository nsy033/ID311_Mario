// Assets
import block from '../data/block.png';
import grass from '../data/grass.png';
import { Environment } from '../src/Environment';

class Block extends Environment {
  constructor(i, j, dir) {
    super(i, j, dir);
    this.img = loadImage(block);
  }
}

class Grass extends Environment {
  constructor(i, j, dir) {
    super(i, j, dir);
    this.img = loadImage(grass);
  }
}

export { Block, Grass };
