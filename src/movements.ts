import {
  BOARD_LAYOUT,
  BOARD_SIZE,
  MAP_ENTITIES,
  DIRECTION_GEARBOX,
} from './constants';
import { GameEntity, Direction } from './types';

function getXYCoordinates(cellIdx: number) {
  return [cellIdx % BOARD_SIZE, Math.floor(cellIdx / BOARD_SIZE)];
}

function getIdxCoordinates(x: number, y: number) {
  return y * BOARD_SIZE + x;
}

function getDistanceAtBoardBoundaries(direction: Direction, idx: number) {
  const [x, y] = getXYCoordinates(idx);
  if (direction === Direction.Left && x === 0) {
    return getIdxCoordinates(BOARD_SIZE - 1, y) - idx;
  }
  if (direction === Direction.Up && y === 0) {
    return getIdxCoordinates(x, BOARD_SIZE - 1) - idx;
  }
  if (direction === Direction.Right && x === BOARD_SIZE - 1) {
    return getIdxCoordinates(0, y) - idx;
  }
  if (direction === Direction.Down && y === BOARD_SIZE - 1) {
    return getIdxCoordinates(x, 0) - idx;
  }
  return 0;
}

export function goTo(there: Direction, idx: number) {
  const distance =
    getDistanceAtBoardBoundaries(there, idx) || DIRECTION_GEARBOX[there];

  const nextCell = BOARD_LAYOUT[idx + distance];
  const isCollision = MAP_ENTITIES[nextCell] === GameEntity.Wall;

  if (isCollision) {
    console.info(`Skipped Keycode ${there}: collision detected`);
  }

  return isCollision ? idx : idx + distance;
}
