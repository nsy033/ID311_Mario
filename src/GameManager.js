import {
  CANVAS_WIDTH,
  ENDCIRCLE_SIZE,
  ENDCIRCLE_SIZE_STEP,
  ENDCIRCLE_WEIGHT,
  FAILURE_INTERVAL,
  FAILURE_TIMEOUT,
  STATUS,
  SUCCESS_INTERVAL,
  SUCCESS_TIMEOUT,
} from './Constants';

class GameManager {
  constructor(sounds) {
    this.status = STATUS.ready;
    this.sounds = sounds;
    this.gameoverCircle = {
      size: CANVAS_WIDTH * 3.5,
      weight: ENDCIRCLE_WEIGHT,
    };
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
          isSuccessful ? SUCCESS_INTERVAL : FAILURE_INTERVAL
        );
      },
      isSuccessful ? SUCCESS_TIMEOUT : FAILURE_TIMEOUT
    );
  }

  update(source, ...args) {
    if (source.includes('gameover') && this.getStatus() != STATUS.gameover) {
      this.setStatus(STATUS.gameover);

      this.sounds['titleTheme'].stop();
      this.sounds['gameOver'].play();

      this.animateEndingMotion(false);
    } else if (
      source.includes('succeed') &&
      this.getStatus() != STATUS.succeed
    ) {
      this.setStatus(STATUS.succeed);
      this.sounds['titleTheme'].stop();
      this.sounds['courseClear'].play();

      this.animateEndingMotion(true);
    }
  }
}

export { GameManager };
