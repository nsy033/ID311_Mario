import { TILE_SIZE, HALF_TILE_SIZE, MARIO_MARGIN } from './Constants';

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
export const calcCoordinates = (x, y, isMario) => {
  const coordinates = {};

  if (isMario) {
    coordinates.upperLeft = {
      x: x - HALF_TILE_SIZE + MARIO_MARGIN,
      y: y - HALF_TILE_SIZE,
    };
    coordinates.upperRight = {
      x: x + HALF_TILE_SIZE - MARIO_MARGIN,
      y: y - HALF_TILE_SIZE,
    };
    coordinates.lowerLeft = {
      x: x - HALF_TILE_SIZE + MARIO_MARGIN,
      y: y + HALF_TILE_SIZE,
    };
    coordinates.lowerRight = {
      x: x + HALF_TILE_SIZE - MARIO_MARGIN,
      y: y + HALF_TILE_SIZE,
    };
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
