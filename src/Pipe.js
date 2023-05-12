// Assets
import up from '../data/images/pipe-up.png';
import down from '../data/images/pipe-down.png';
import left from '../data/images/pipe-left.png';
import right from '../data/images/pipe-right.png';
import center from '../data/images/pipe-center.png';

import { Subject } from './Subject';
import { TILE_SIZE, DIRECTION, PIPE_MARGIN } from './Constants';
import { calcCoordinates, collisionTest, ij2xy } from './utilities';

class Pipe extends Subject {
  constructor(i, j, dir) {
    super(i, j, dir);

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
    if (this.dir == 0) {
      for (let variant = 0; variant < 5; variant++) {
        const [x, y] = ij2xy(
          this.i + this.dy[variant],
          this.j + this.dx[variant]
        );
        image(this.pipes[variant], x, y, TILE_SIZE, TILE_SIZE);
      }
    } else {
      for (let variant = 0; variant < 5; variant++) {
        const [x, y] = ij2xy(
          this.i + this.dy[variant],
          this.j + this.dx[variant]
        );
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
    if (source == 'mario-wants-to-move') {
      for (let variant = 0; variant < 4; variant++) {
        if (collisionTest(this.coordinates[variant], args[0])) {
          this.notifySubscribers('gravity-direction-changes', {
            direction: variant,
            center: [this.i, this.j],
            clockwise: this.dir,
          });
          break;
        }
      }
    } else if (source == 'mario-follows-gravity') {
      for (let variant = 0; variant < 4; variant++) {
        if (collisionTest(this.coordinates[variant], args[0])) {
          this.notifySubscribers('gravity-direction-changes', {
            direction: variant,
            center: [this.i, this.j],
            clockwise: this.dir,
          });
          break;
        }
      }
    } else if (source == 'fire-wants-to-move') {
      for (let variant = 0; variant < 5; variant++) {
        if (collisionTest(this.coordinates[variant], args[0])) {
          this.notifySubscribers('pipe-change-fire-dir', args[1], args[2]);
        }
      }
    }
  }
}

export { Pipe };
