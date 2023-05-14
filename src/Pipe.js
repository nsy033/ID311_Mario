import up from '../data/images/pipe-up.png';
import down from '../data/images/pipe-down.png';
import left from '../data/images/pipe-left.png';
import right from '../data/images/pipe-right.png';
import center from '../data/images/pipe-center.png';

import { TILE_SIZE, DIRECTION } from './Constants';
import { Subject } from './Subject';
import { calcCoordinates, collisionTest, ij2xy } from './utilities';

class Pipe extends Subject {
  constructor(i, j, dir) {
    super(i, j, dir);
    /*
      In the case of pipes, only [i][j] corresponding to the center is externally specified
      and the image and coordinate of the top, bottom, left, and right sides
      are calculated and used only internally
    */

    this.dx = [-1, 0, 1, 0, 0];
    this.dy = [0, -1, 0, 1, 0];
    this.pipes = [];
    this.pipes.push(loadImage(up));
    this.pipes.push(loadImage(left));
    this.pipes.push(loadImage(down));
    this.pipes.push(loadImage(right));
    this.pipes.push(loadImage(center));

    this.coordinates = [];
    for (let variant = 0; variant < 5; variant++) {
      const [x, y] = ij2xy(
        this.i + this.dy[variant],
        this.j + this.dx[variant]
      );
      this.coordinates[variant] = calcCoordinates(x, y, 'pipe', variant);
    }
  }

  draw() {
    // Within one object, draw all the images corresponding to each of the center, top, bottom, left, and right parts
    // Depending on whether it rotates Mario clockwise or counterclockwise, draw the overall picture in reverse
    if (this.dir == 0) {
      // clockwise case
      for (let variant = 0; variant < 5; variant++) {
        const [x, y] = ij2xy(
          this.i + this.dy[variant],
          this.j + this.dx[variant]
        );
        image(this.pipes[variant], x, y, TILE_SIZE, TILE_SIZE);
      }
    } else {
      // counterclockwise case
      for (let variant = 0; variant < 5; variant++) {
        const [x, y] = ij2xy(
          this.i + this.dy[variant],
          this.j + this.dx[variant]
        );

        // make the canvas in reverse horizontally
        translate(x, y);
        scale(-1, 1);

        if (variant % 2 == 1)
          image(this.pipes[(variant + 2) % 4], 0, 0, TILE_SIZE, TILE_SIZE);
        else image(this.pipes[variant], 0, 0, TILE_SIZE, TILE_SIZE);
        resetMatrix();
      }
    }
  }

  update(source, ...args) {
    // detect collision, and notify the cause provider that the collision happens with whom
    // as this is pipes, ...
    /*
        i. if it collides with Mario, then it notifies that
           the gravitational direction may be changed into `this.dir` way
      */
    if (source == 'mario-wants-to-move') {
      const marioCoord = args[0],
        marioDir = args[1];
      for (let variant = 0; variant < 4; variant++) {
        if (collisionTest(this.coordinates[variant], marioCoord)) {
          // check whether this collision is of the correct entrance of the pipe
          let marioGoIntoPipe = false;
          if (variant != marioDir && variant % 2 == marioDir % 2) {
            switch (marioDir) {
              case DIRECTION.up:
                if (
                  this.coordinates[variant].lowerLeft.y ==
                  marioCoord.lowerLeft.y
                )
                  marioGoIntoPipe = true;
                break;
              case DIRECTION.down:
                if (
                  this.coordinates[variant].upperLeft.y ==
                  marioCoord.lowerLeft.y
                )
                  marioGoIntoPipe = true;
                break;
              case DIRECTION.left:
                if (
                  this.coordinates[variant].lowerRight.x ==
                  marioCoord.lowerLeft.x
                )
                  marioGoIntoPipe = true;
                break;
              case DIRECTION.right:
                if (
                  this.coordinates[variant].lowerLeft.x ==
                  marioCoord.lowerLeft.x
                )
                  marioGoIntoPipe = true;
                break;
            }
          }
          if (marioGoIntoPipe)
            this.notifySubscribers('gravity-direction-changes-moving', {
              direction: variant,
              center: [this.i, this.j],
              clockwise: this.dir,
            });
          else
            this.notifySubscribers('pipe-collides', this.coordinates, variant);
        }
      }
    } else if (source == 'mario-follows-gravity') {
      const marioCoord = args[0],
        marioDir = args[1];
      for (let variant = 0; variant < 4; variant++) {
        if (collisionTest(this.coordinates[variant], marioCoord)) {
          // check whether this collision is of the correct entrance of the pipe
          if (variant != marioDir && variant % 2 == marioDir % 2) {
            this.notifySubscribers('gravity-direction-changes-floating', {
              direction: variant,
              center: [this.i, this.j],
              clockwise: this.dir,
            });
          } else {
            this.notifySubscribers('pipe-holds', this.coordinates, variant);
          }
        }
      }
    } else if (source == 'fire-wants-to-move') {
      /*
        ii. if it collides with Fire, then it just notifies that
            this way is blocked because of pipe so that you should do U-turn
      */
      for (let variant = 0; variant < 5; variant++) {
        if (collisionTest(this.coordinates[variant], args[0])) {
          this.notifySubscribers('pipe-change-fire-dir', args[1], args[2]);
        }
      }
    }
  }
}

export { Pipe };
