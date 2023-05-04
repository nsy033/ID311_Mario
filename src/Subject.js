import { TILE_SIZE } from '../src/Constants';
import { ij2xy } from './utilities';

class Subject {
  constructor(i, j, dir) {
    this.observers = [];
    this.img = '';
    this.i = i;
    this.j = j;
    this.dir = dir;
  }
  subscribe(observer) {
    if (observer && !this.observers.includes(observer))
      this.observers.push(observer);
  }
  unsubscribe(observer) {
    this.observers = this.observers.filter((o) => o != observer);
  }
  unsubscribeAll() {
    this.observers = [];
  }

  notifySubscribers(source, ...others) {
    for (const observer of this.observers) observer.update(source, ...others);
  }

  draw() {
    const [x, y] = ij2xy(this.i, this.j);

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

export { Subject };
