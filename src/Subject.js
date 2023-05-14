import { DIRECTION, TILE_SIZE } from '../src/Constants';
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

  /*
    Since all Subjects in my code structure are also sth that is drawn on the map,
    I implemented draw() here to reduce unnecessary repetition of the code
  */
  draw() {
    /*
      Since each Subject has only [i][j] as attributes, in which index on the tile of the map,
      calculate (x, y), in which coordinate on the canvas
    */
    const [x, y] = ij2xy(this.i, this.j);

    if (this.dir == DIRECTION.up) image(this.img, x, y, TILE_SIZE, TILE_SIZE);
    else {
      translate(x, y);
      let angle = -90; // this.dir == DIRECTION.left
      if (this.dir == DIRECTION.down) {
        angle = 180;
      } else if (this.dir == DIRECTION.right) {
        angle = 90;
      }
      rotate(angle);

      // make the canvas orientation to draw each image in appropriate position
      image(this.img, 0, 0, TILE_SIZE, TILE_SIZE);
    }
    resetMatrix();
  }
}

export { Subject };
