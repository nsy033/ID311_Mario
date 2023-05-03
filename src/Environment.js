import { HALF_TILE_SIZE, TILE_SIZE } from '../src/Constants';

class Environment {
  constructor(i, j, dir) {
    this.img = '';
    this.i = i;
    this.j = j;
    this.dir = dir;
  }

  draw() {
    const x = this.i * TILE_SIZE + HALF_TILE_SIZE,
      y = this.j * TILE_SIZE + HALF_TILE_SIZE;

    if (this.dir == 0) image(this.img, x, y, TILE_SIZE, TILE_SIZE);
    else {
      translate(x, y);

      let angle = -90;
      if (this.dir == 2) {
        angle = 180;
      } else if (this.dir == 3) {
        angle = 90;
      }

      rotate(angle);
      image(this.img, 0, 0, TILE_SIZE, TILE_SIZE);
    }
    resetMatrix();
  }
}

export { Environment };
