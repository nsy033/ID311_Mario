import {
  TILE_SIZE,
  HALF_TILE_SIZE,
  MARIO_MARGIN_LR,
  MARIO_MARGIN_TOP,
  DIRECTION,
} from './Constants';

export const ij2xy = (i, j) => {
  // convert (i, j) coordinate in terms of indices of tile into (x, y) coordinate in terms of the canvas
  const x = i * TILE_SIZE + HALF_TILE_SIZE;
  const y = j * TILE_SIZE + HALF_TILE_SIZE;
  return [x, y];
};
export const xy2ij = (x, y) => {
  // convert (x, y) coordinate in terms of the canvas into (i, j) coordinate in terms of indices of tile
  const i = Math.floor(x / TILE_SIZE);
  const j = Math.floor(y / TILE_SIZE);
  return [i, j];
};
export const collisionTest = (coord1, coord2) => {
  /* each coord has structure of
      {
          upperLeft: {x: _, y: _},
          upperRight: {x: _, y: _},
          lowerLeft: {x: _, y: _},
          lowerRight: {x: _, y: _}
      }
    here, x and y means the coordinates in terms of the canvas
  */
  // run collision test and return true if the two rectangles collides according to the coordinates
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
  /* coordinates has structure of
    {
        upperLeft: {x: _, y: _},
        upperRight: {x: _, y: _},
        lowerLeft: {x: _, y: _},
        lowerRight: {x: _, y: _}
    }
    here, x and y means the coordinates in terms of the canvas
  */

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

  /*
    if the target object to calculate coordinate is mario,
    as it has empty space in PNG file,
    it should be specified that certain areas are empty
    which differ according to the gravitational direction
  */
  if (isMario) {
    if (dir % 2 == DIRECTION.up) {
      coordinates.upperLeft.x += MARIO_MARGIN_LR;
      coordinates.lowerLeft.x += MARIO_MARGIN_LR;
      coordinates.upperRight.x -= MARIO_MARGIN_LR;
      coordinates.lowerRight.x -= MARIO_MARGIN_LR;

      if (dir == DIRECTION.up) {
        coordinates.lowerLeft.y -= MARIO_MARGIN_TOP;
        coordinates.lowerRight.y -= MARIO_MARGIN_TOP;
      } else {
        // dir == DIRECTION.down
        coordinates.upperLeft.y += MARIO_MARGIN_TOP;
        coordinates.upperRight.y += MARIO_MARGIN_TOP;
      }
    } else {
      // dir % 2 == DIRECTION.left
      coordinates.upperLeft.y += MARIO_MARGIN_LR;
      coordinates.upperRight.y += MARIO_MARGIN_LR;
      coordinates.lowerLeft.y -= MARIO_MARGIN_LR;
      coordinates.lowerRight.y -= MARIO_MARGIN_LR;

      if (dir == DIRECTION.left) {
        coordinates.upperRight.x -= MARIO_MARGIN_TOP;
        coordinates.lowerRight.x -= MARIO_MARGIN_TOP;
      } else {
        // dir == DIRECTION.right
        coordinates.upperLeft.x += MARIO_MARGIN_TOP;
        coordinates.lowerLeft.x += MARIO_MARGIN_TOP;
      }
    }
  }
  return coordinates;
};
