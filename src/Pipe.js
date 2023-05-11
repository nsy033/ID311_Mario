// Assets
import up from '../data/images/pipe-up.png';
import down from '../data/images/pipe-down.png';
import left from '../data/images/pipe-left.png';
import right from '../data/images/pipe-right.png';
import center from '../data/images/pipe-center.png';

import { Subject } from './Subject';
import { GameManager } from './GameManager';
import { TILE_SIZE, STATUS } from './Constants';
import { calcCoordinates, collisionTest, ij2xy } from './utilities';

class Pipe extends Subject {
  constructor(i, j, dir) {
    super(i, j, dir);

    this.dx = [0, 0, 0, 1, -1];
    this.dy = [0, 1, -1, 0, 0];
    this.pipes = [];
    this.pipes.push(loadImage(center));
    this.pipes.push(loadImage(right));
    this.pipes.push(loadImage(left));
    this.pipes.push(loadImage(down));
    this.pipes.push(loadImage(up));

    const [x, y] = ij2xy(this.i, this.j);
    this.coordinates = calcCoordinates(x, y, false);

    this.angle = 0;
  }

  draw() {
    for (let variant = 0; variant < 5; variant++) {
      const [x, y] = ij2xy(
        this.i + this.dy[variant],
        this.j + this.dx[variant]
      );
      image(this.pipes[variant], x, y, TILE_SIZE, TILE_SIZE);
    }

    resetMatrix();

    if (GameManager.getInstance().getStatus() == STATUS.gameover) return;
  }

  update(source, ...args) {
    if (source == 'mario-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('gravity-direction-changes', this.coordinates);
      }
    } else if (source == 'mario-follows-gravity') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('gravity-direction-changes', this.coordinates);
      }
    } else if (source == 'fire-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('directioner-change-fire-dir', args[1], args[2]);
      }
    }
  }
}

export { Pipe };
