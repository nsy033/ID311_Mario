import mario_float from '../data/images/mario-float.png';
import mario_stable from '../data/images/mario-stable.png';
import mario_walk from '../data/images/mario-walk.png';
import mario_hurt from '../data/images/mario-hurt.png';
import pipe_sound from '../data/sounds/pipe-sound-effect.mp3';

import {
  TILE_SIZE,
  MARIO_STEP,
  GRAVITY_STEP,
  DIRECTION,
  STATUS,
} from '../src/Constants';
import { Subject } from './Subject';
import { GameManager } from './GameManager';
import { calcCoordinates, ij2xy, xy2ij } from './utilities';

class Mario extends Subject {
  constructor() {
    super();

    this.images = {};
    this.images['float'] = loadImage(mario_float);
    this.images['stable'] = loadImage(mario_stable);
    this.images['walk'] = loadImage(mario_walk);
    this.images['hurt'] = loadImage(mario_hurt);
    this.pipe_sound = loadSound(pipe_sound);

    this.img2display = 'stable'; // key value of this.images for the images to display
    this.gravityCache = new Set(); // keeps whether a specific object in [i][j] already checked to be support him from gravity
    this.inPipe = false; // whether he is inside of pipes or not
    this.dir = DIRECTION.down; // his gravitational direction
    this.face = 1; // whether he is facing left or right
    this.coordinates = {};
  }

  static getInstance() {
    // Singleton pattern
    if (!this._instance) this._instance = new Mario();
    return this._instance;
  }

  setPosition(i, j, dir, face) {
    const [x, y] = ij2xy(i, j);

    // since Mario's coordinate in canvas keep changing
    // it has to store the exact (x, y)
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.face = face;
    this.coordinates = calcCoordinates(x, y, 'mario', this.dir);
  }
  getPosition() {
    return { x: this.x, y: this.y, dir: this.dir, face: this.face };
  }

  setDirection(dir) {
    // change the gravitational direction
    this.dir = dir;
  }
  getDirection() {
    return this.dir;
  }

  setInPipe(inPipe) {
    // set inPipe state
    this.inPipe = inPipe;
  }
  getInPipe() {
    return this.inPipe;
  }

  draw() {
    // draw different images according to Mario's state (floating, walking, ...)
    const img = this.images[this.img2display];

    // make the canvas orientation to draw each image in appropriate position and direction
    translate(this.x, this.y);
    if (this.dir == DIRECTION.down) {
      if (this.face == -1) scale(-1, 1);
    } else {
      let angle = -90;
      if (this.dir == DIRECTION.up) {
        if (this.face == 1) scale(-1, 1);
        angle = 180;
      } else if (this.dir == DIRECTION.left) {
        if (this.face == -1) scale(1, -1);
        angle = 90;
      } else {
        if (this.face == 1) scale(1, -1);
        angle = 270;
      }

      rotate(angle);
    }
    image(img, 0, 0, TILE_SIZE, TILE_SIZE);

    resetMatrix();
  }

  move(face) {
    // change the coordinate (x, y) according to
    // i) the gravitational direction and ii) which direction he is facing to
    this.face = face;
    if (this.dir % 2 == 0) this.x += MARIO_STEP * this.face;
    else this.y += MARIO_STEP * this.face;

    // update the coordinates of four corners according the the moving
    // and notify its move result, in order to check collision
    this.coordinates = calcCoordinates(this.x, this.y, 'mario', this.dir);
    this.notifySubscribers('mario-wants-to-move', this.coordinates, this.dir);

    // no need to keep changing his displaying images anymore, if it is in a gameover state
    if (GameManager.getInstance().getStatus() != STATUS.alive) return;

    // change images to display when moving; stable -> walk -> stable -> walk ...
    if (this.img2display == 'stable') this.img2display = 'walk';
    else this.img2display = 'stable';
  }

  receiveGravity() {
    this.gravityCache.clear();
    this.img2display = 'float';
    this.inPipe = false;

    // change the coordinate (x, y) according to the gravitational direction
    if (this.dir == DIRECTION.down) this.y += GRAVITY_STEP;
    else if (this.dir == DIRECTION.up) this.y -= GRAVITY_STEP;
    else if (this.dir == DIRECTION.left) this.x -= GRAVITY_STEP;
    else if (this.dir == DIRECTION.right) this.x += GRAVITY_STEP;

    // update the coordinates of four corners according the the moving
    // and notify its move result, in order to check collision
    this.coordinates = calcCoordinates(this.x, this.y, 'mario', this.dir);
    this.notifySubscribers('mario-follows-gravity', this.coordinates, this.dir);
  }

  standOnSth() {
    // check whether Mario is standing on something or not
    return this.gravityCache.size > 0;
  }
  beStable() {
    // make Mario be stable
    this.img2display = 'stable';
  }

  update(source, ...args) {
    // if the game state is notified to be gameover or succeed, change the image according to it
    if (source.includes('gameover')) {
      this.img2display = 'hurt';
    } else if (source.includes('succeed')) {
      this.img2display = 'float';
    } else {
      if (source.includes('collides')) {
        // if someone said that his movement will collide with it,
        // Mario go back to his original position
        if (source.includes('pipe') && this.dir == args[1]) {
          this.inPipe = true;
          return;
        }

        if (this.dir % 2 == 0) this.x -= MARIO_STEP * this.face;
        else this.y -= MARIO_STEP * this.face;
        this.coordinates = calcCoordinates(this.x, this.y, 'mario', this.dir);
      } else if (source.includes('holds')) {
        // if someone said that he does not move more because of gravity,
        if (source.includes('pipe') && this.dir == args[1]) {
          this.inPipe = true;
          return;
        }

        const [i, j] = xy2ij(this.x, this.y);

        // display a proper image, not floating
        if (this.img2display == 'float') this.img2display = 'stable';
        else this.img2display = 'walk';

        // Mario go back to his original position
        if (!this.gravityCache.has((i, j))) {
          this.gravityCache.add((i, j));

          if (this.dir == DIRECTION.down) this.y -= GRAVITY_STEP;
          else if (this.dir == DIRECTION.up) this.y += GRAVITY_STEP;
          else if (this.dir == DIRECTION.left) this.x += GRAVITY_STEP;
          else if (this.dir == DIRECTION.right) this.x -= GRAVITY_STEP;
          this.coordinates = calcCoordinates(this.x, this.y, 'mario', this.dir);
        }
      } else if (source.includes('gravity-direction-changes')) {
        // if someone said that he collides with it,
        const { direction, center, clockwise } = args[0];

        // if Mario went into the correct entrance of the pipe

        // play the pipe-passing sound
        this.pipe_sound.play();

        // change the gravitational direction 90 deg
        if (clockwise == 0) this.dir = this.dir == 0 ? 3 : this.dir - 1;
        else this.dir = this.dir == 3 ? 0 : this.dir + 1;

        // move (from the entrance) to the very center of the pipes
        const [i, j] = center;
        const [x, y] = ij2xy(i, j);
        this.x = x;
        this.y = y;
        this.coordinates = calcCoordinates(x, y, 'mario', this.dir);
        this.inPipe = true;
      }
    }
  }
}

export { Mario };
