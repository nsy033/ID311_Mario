import { STATUS } from './Constants';

class GameManager {
  constructor(sounds) {
    this.status = STATUS.ready;
    this.sounds = sounds;
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
    this.setStatus(STATUS.alive);
    this.sounds['itsMeMario'].play();
    setTimeout(() => this.sounds['titleTheme'].loop(), 2000);
  }

  update(source, ...args) {
    if (source.includes('gameover')) {
      this.setStatus(STATUS.gameover);
      this.sounds['titleTheme'].stop();
      this.sounds['gameOver'].play();
    } else if (source.includes('succeed')) {
      this.setStatus(STATUS.succeed);
      this.sounds['titleTheme'].stop();
      this.sounds['courseClear'].play();
    }
  }
}

export { GameManager };
