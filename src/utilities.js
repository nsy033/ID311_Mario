import {
  TILE_SIZE,
  HALF_TILE_SIZE,
  MARIO_MARGIN_LR,
  MARIO_MARGIN_TOP,
  DIRECTION,
} from './Constants';

export const ij2xy = (i, j) => {
  const x = i * TILE_SIZE + HALF_TILE_SIZE;
  const y = j * TILE_SIZE + HALF_TILE_SIZE;
  return [x, y];
};
export const xy2ij = (x, y) => {
  const i = Math.floor(x / TILE_SIZE);
  const j = Math.floor(y / TILE_SIZE);
  return [i, j];
};
export const collisionTest = (coord1, coord2) => {
  if (
    coord2.upperLeft.x < coord1.upperRight.x &&
    coord1.upperLeft.x < coord2.upperRight.x &&
    coord2.upperLeft.y < coord1.lowerLeft.y &&
    coord1.upperLeft.y < coord2.lowerLeft.y
  ) {
    return true;
  }

  if (
    coord2.upperLeft.x > coord1.upperRight.x &&
    coord1.upperLeft.x > coord2.upperRight.x &&
    coord2.upperLeft.y > coord1.lowerLeft.y &&
    coord1.upperLeft.y > coord2.lowerLeft.y
  ) {
    return true;
  }

  return false;
};
export const calcCoordinates = (x, y, isMario, dir) => {
  const coordinates = {};

  if (isMario) {
    if (dir == DIRECTION.up) {
      coordinates.upperLeft = {
        x: x - HALF_TILE_SIZE + MARIO_MARGIN_LR,
        y: y - HALF_TILE_SIZE + MARIO_MARGIN_TOP,
      };
      coordinates.upperRight = {
        x: x + HALF_TILE_SIZE - MARIO_MARGIN_LR,
        y: y - HALF_TILE_SIZE + MARIO_MARGIN_TOP,
      };
      coordinates.lowerLeft = {
        x: x - HALF_TILE_SIZE + MARIO_MARGIN_LR,
        y: y + HALF_TILE_SIZE,
      };
      coordinates.lowerRight = {
        x: x + HALF_TILE_SIZE - MARIO_MARGIN_LR,
        y: y + HALF_TILE_SIZE,
      };
    } else if (dir == DIRECTION.down) {
      coordinates.upperLeft = {
        x: x - HALF_TILE_SIZE + MARIO_MARGIN_LR,
        y: y - HALF_TILE_SIZE,
      };
      coordinates.upperRight = {
        x: x + HALF_TILE_SIZE - MARIO_MARGIN_LR,
        y: y - HALF_TILE_SIZE,
      };
      coordinates.lowerLeft = {
        x: x - HALF_TILE_SIZE + MARIO_MARGIN_LR,
        y: y + HALF_TILE_SIZE - MARIO_MARGIN_TOP,
      };
      coordinates.lowerRight = {
        x: x + HALF_TILE_SIZE - MARIO_MARGIN_LR,
        y: y + HALF_TILE_SIZE - MARIO_MARGIN_TOP,
      };
    } else if (dir == DIRECTION.right) {
      coordinates.upperLeft = {
        x: x - HALF_TILE_SIZE + MARIO_MARGIN_TOP,
        y: y - HALF_TILE_SIZE + MARIO_MARGIN_LR,
      };
      coordinates.upperRight = {
        x: x + HALF_TILE_SIZE,
        y: y - HALF_TILE_SIZE + MARIO_MARGIN_LR,
      };
      coordinates.lowerLeft = {
        x: x - HALF_TILE_SIZE + MARIO_MARGIN_TOP,
        y: y + HALF_TILE_SIZE - MARIO_MARGIN_LR,
      };
      coordinates.lowerRight = {
        x: x + HALF_TILE_SIZE,
        y: y + HALF_TILE_SIZE - MARIO_MARGIN_LR,
      };
    } else {
      coordinates.upperLeft = {
        x: x - HALF_TILE_SIZE,
        y: y - HALF_TILE_SIZE + MARIO_MARGIN_LR,
      };
      coordinates.upperRight = {
        x: x + HALF_TILE_SIZE - MARIO_MARGIN_TOP,
        y: y - HALF_TILE_SIZE + MARIO_MARGIN_LR,
      };
      coordinates.lowerLeft = {
        x: x - HALF_TILE_SIZE,
        y: y + HALF_TILE_SIZE - MARIO_MARGIN_LR,
      };
      coordinates.lowerRight = {
        x: x + HALF_TILE_SIZE - MARIO_MARGIN_TOP,
        y: y + HALF_TILE_SIZE - MARIO_MARGIN_LR,
      };
    }
  } else {
    coordinates.upperLeft = {
      x: x - HALF_TILE_SIZE,
      y: y - HALF_TILE_SIZE,
    };
    coordinates.upperRight = {
      x: x + HALF_TILE_SIZE,
      y: y - HALF_TILE_SIZE,
    };
    coordinates.lowerLeft = {
      x: x - HALF_TILE_SIZE,
      y: y + HALF_TILE_SIZE,
    };
    coordinates.lowerRight = {
      x: x + HALF_TILE_SIZE,
      y: y + HALF_TILE_SIZE,
    };
  }
  return coordinates;
};
