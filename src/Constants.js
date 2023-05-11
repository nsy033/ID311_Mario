export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT = 720;
export const STARTBTN_WIDTH = 350;
export const STARTBTN_HEIGHT = 50;

export const TILE_SIZE = 45;
export const HALF_TILE_SIZE = 45 / 2;
export const TILE_W_COUNT = 24;
export const TILE_H_COUNT = 16;
export const GRAVITY_STEP = 8;
export const MARIO_STEP = 8;
export const MARIO_MARGIN_LR = 10;
export const MARIO_MARGIN_TOP = 5;
export const FIRE_STEP = 2;
export const THORN_MARGIN = 10;
export const PIPE_MARGIN = 12;
export const TIME_INTERVAL = 50;

export const ENDCIRCLE_SIZE = 1400;
export const ENDCIRCLE_SIZE_STEP = 50;
export const ENDCIRCLE_WEIGHT = 1200;
export const SUCCESS_INTERVAL = 30;
export const FAILURE_INTERVAL = 45;
export const SUCCESS_TIMEOUT = 2000;
export const FAILURE_TIMEOUT = 3000;

export const CELL_TYPES = {
  empty: 0,
  block: 1,
  grass: 2,
  star: 3,
  starblock: 4,
  fire: 5,
  thorn: 6,
  pipe: 7,
};
export const DIRECTION = {
  up: 0,
  left: 1,
  down: 2,
  right: 3,
};
export const STATUS = {
  alive: 0,
  gameover: 1,
  succeed: 2,
  ready: 100,
};
