import up from '../data/images/pipe-up.png';
import down from '../data/images/pipe-down.png';
import left from '../data/images/pipe-left.png';
import right from '../data/images/pipe-right.png';
import center from '../data/images/pipe-center.png';

import { TILE_SIZE, DIRECTION, PIPE_MARGIN } from './Constants';
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
      this.coordinates[variant] = calcCoordinates(x, y, false);

      if (variant == DIRECTION.up) {
        this.coordinates[variant].upperLeft.y += PIPE_MARGIN;
        this.coordinates[variant].upperRight.y += PIPE_MARGIN;
      } else if (variant == DIRECTION.left) {
        this.coordinates[variant].upperLeft.x += PIPE_MARGIN;
        this.coordinates[variant].lowerLeft.x += PIPE_MARGIN;
      } else if (variant == DIRECTION.down) {
        this.coordinates[variant].lowerLeft.y -= PIPE_MARGIN;
        this.coordinates[variant].lowerRight.y -= PIPE_MARGIN;
      } else if (variant == DIRECTION.right) {
        this.coordinates[variant].upperRight.x -= PIPE_MARGIN;
        this.coordinates[variant].lowerRight.x -= PIPE_MARGIN;
      }
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
    if (source == 'mario-follows-gravity') {
      /*
        i. if it collides with Mario, then it notifies that
           the gravitational direction is changed into `this.dir` way
      */
      for (let variant = 0; variant < 4; variant++) {
        if (collisionTest(this.coordinates[variant], args[0])) {
          this.notifySubscribers('gravity-direction-changes-floating', {
            direction: variant,
            center: [this.i, this.j],
            clockwise: this.dir,
          });
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
