import { STATUS } from './Constants';

class GameManager {
  constructor() {
    this.status = STATUS.alive;
  }

  static getInstance() {
    if (!this._instance) this._instance = new GameManager();
    return this._instance;
  }

  getStatus() {
    return this.status;
  }
  setStatus(status) {
    this.status = status;
  }

  update(source, ...args) {
    if (source.includes('gameover')) {
      this.setStatus(STATUS.gameover);
    } else if (source.includes('succeed')) {
      this.setStatus(STATUS.succeed);
    }
  }
}

export { GameManager };
