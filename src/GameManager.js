import {
  CANVAS_WIDTH,
  ENDCIRCLE_SIZE,
  ENDCIRCLE_SIZE_STEP,
  ENDCIRCLE_WEIGHT,
  STATUS,
} from './Constants';

class GameManager {
  constructor(sounds) {
    this.status = STATUS.ready;
    this.sounds = sounds;
    this.gameoverCircle = { size: CANVAS_WIDTH * 3, weight: ENDCIRCLE_WEIGHT };
  }

  static getInstance(sounds) {
    if (!this._instance) this._instance = new GameManager(sounds);
    return this._instance;
  }

  getStatus() {
    return this.status;
  }
  setStatus(status) {
    this.status = status;
  }

  getStarted() {
    if (this.getStatus() != STATUS.alive) {
      this.setStatus(STATUS.alive);
      this.sounds['titleTheme'].loop();
    }
  }

  drawEnding({ x, y }) {
    noFill();
    stroke(0);
    strokeWeight(ENDCIRCLE_WEIGHT);
    ellipseMode(CENTER);
    ellipse(x, y, this.gameoverCircle.size, this.gameoverCircle.size);
  }

  animateEndingMotion(isSuccessful) {
    setTimeout(
      () => {
        setInterval(
          () => {
            this.gameoverCircle.size =
              this.gameoverCircle.size - ENDCIRCLE_SIZE_STEP > ENDCIRCLE_SIZE
                ? this.gameoverCircle.size - ENDCIRCLE_SIZE_STEP
                : ENDCIRCLE_SIZE;
          },
          isSuccessful ? 30 : 50
        );
      },
      isSuccessful ? 2000 : 3000
    );
  }

  update(source, ...args) {
    if (source.includes('gameover')) {
      this.setStatus(STATUS.gameover);
      this.sounds['titleTheme'].stop();
      this.sounds['gameOver'].play();

      this.animateEndingMotion(false);
    } else if (source.includes('succeed')) {
      this.setStatus(STATUS.succeed);
      this.sounds['titleTheme'].stop();
      this.sounds['courseClear'].play();

      this.animateEndingMotion(true);
    }
  }
}

export { GameManager };
