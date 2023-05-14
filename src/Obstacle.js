import fire from '../data/images/fire.png';
import thorn from '../data/images/thorn.png';

import { DIRECTION, TILE_SIZE, FIRE_STEP, STATUS } from './Constants';
import { Subject } from '../src/Subject';
import { GameManager } from './GameManager';
import { calcCoordinates, collisionTest, ij2xy } from './utilities';

class Fire extends Subject {
  constructor(i, j, dir) {
    super(i, j, dir);
    this.img = loadImage(fire);

    // since fire's coordinate in canvas keep changing, as it is moving continuously
    // it has to store the exact (x, y) as well as [i][j]
    const [x, y] = ij2xy(this.i, this.j);
    this.x = x;
    this.y = y;
    // coordinates of four corners of itself as a rectangle in the canvas
    this.coordinates = calcCoordinates(x, y, 'fire', this.dir);
  }

  draw() {
    if (this.dir % 2 == DIRECTION.up) {
      image(this.img, this.x, this.y, TILE_SIZE, TILE_SIZE);
    } else {
      // make the canvas orientation to draw each image in appropriate position
      translate(this.x, this.y);
      rotate(90);

      image(this.img, 0, 0, TILE_SIZE, TILE_SIZE);
    }
    resetMatrix();

    // no need to move anymore, if it is in a gameover state
    if (GameManager.getInstance().getStatus() == STATUS.gameover) return;

    // fire keeps moving according to its assigned direction
    if (this.dir == DIRECTION.up) this.y -= FIRE_STEP;
    else if (this.dir == DIRECTION.down) this.y += FIRE_STEP;
    else if (this.dir == DIRECTION.left) this.x -= FIRE_STEP;
    else if (this.dir == DIRECTION.right) this.x += FIRE_STEP;
    // update the coordinates of four corners according the the moving
    this.coordinates = calcCoordinates(this.x, this.y, 'fire', this.dir);

    // notify its move result, in order to check collision so that to do U-turn if needed
    this.notifySubscribers(
      'fire-wants-to-move',
      this.coordinates,
      this.i,
      this.j
    );
  }

  update(source, ...args) {
    // detect collision, and notify the cause provider that the collision happens with whom
    // as this is a obstacle which can hurt Mario, if it collides with Mario, then also notify the gameover
    if (source == 'mario-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('fire-collides-gameover', this.coordinates);
      }
    } else if (source == 'mario-follows-gravity') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('fire-holds-gameover', this.coordinates);
      }
    } else if (source.includes('change-fire-dir')) {
      // If there is a collision with another environmental object due to this fire's movement,
      if (!(args[0] == this.i && args[1] == this.j)) return;

      // it cancels the recent movement, changes the direction of the movement in reverse
      if (this.dir == DIRECTION.up) this.y += FIRE_STEP;
      else if (this.dir == DIRECTION.down) this.y -= FIRE_STEP;
      else if (this.dir == DIRECTION.left) this.x += FIRE_STEP;
      else if (this.dir == DIRECTION.right) this.x -= FIRE_STEP;
      this.dir = (this.dir + 2) % 4;
    }
  }
}

class Thorn extends Subject {
  constructor(i, j, dir) {
    super(i, j, dir);
    this.img = loadImage(thorn);

    const [x, y] = ij2xy(this.i, this.j);
    // coordinates of four corners of itself as a rectangle in the canvas
    this.coordinates = calcCoordinates(x, y, 'thorn', this.dir);
  }

  update(source, ...args) {
    // detect collision, and notify the cause provider that the collision happens with whom
    // as this is a obstacle which can hurt Mario, if it collides with Mario, then also notify the gameover
    if (source == 'mario-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('thorn-collides-gameover', this.coordinates);
      }
    } else if (source == 'mario-follows-gravity') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('thorn-holds-gameover', this.coordinates);
      }
    } else if (source == 'fire-wants-to-move') {
      if (collisionTest(this.coordinates, args[0])) {
        this.notifySubscribers('thorn-change-fire-dir', args[1], args[2]);
      }
    }
  }
}

export { Fire, Thorn };
