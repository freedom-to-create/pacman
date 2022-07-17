import {
  BOARD_LAYOUT,
  BOARD_SIZE,
  STATIC_MAP_ENTITIES,
  DIRECTION_GEARBOX,
  PACMAN_INITIAL_LOCATION,
} from '../constants';
import { GameEntity, Direction } from '../commonTypes';

type PacmanConstructorParams = { board: Element[]; onMoved?: () => void };

export class Pacman {
  currentIndex = PACMAN_INITIAL_LOCATION;
  private onMoved;
  private board;
  constructor({ board, onMoved }: PacmanConstructorParams) {
    board[this.currentIndex].classList.add(GameEntity.Packman);
    this.board = board;
    this.onMoved = onMoved;
  }
  private getXYCoordinates(idx: number) {
    return [idx % BOARD_SIZE, Math.floor(idx / BOARD_SIZE)];
  }

  private getIdxCoordinates(x: number, y: number) {
    return y * BOARD_SIZE + x;
  }

  private getDistanceAtBoardBoundaries(direction: Direction, idx: number) {
    const [x, y] = this.getXYCoordinates(idx);
    if (direction === Direction.Left && x === 0) {
      return this.getIdxCoordinates(BOARD_SIZE - 1, y) - idx;
    }
    if (direction === Direction.Up && y === 0) {
      return this.getIdxCoordinates(x, BOARD_SIZE - 1) - idx;
    }
    if (direction === Direction.Right && x === BOARD_SIZE - 1) {
      return this.getIdxCoordinates(0, y) - idx;
    }
    if (direction === Direction.Down && y === BOARD_SIZE - 1) {
      return this.getIdxCoordinates(x, 0) - idx;
    }
    return 0;
  }
  goTo(there: Direction) {
    const distance =
      this.getDistanceAtBoardBoundaries(there, this.currentIndex) ||
      DIRECTION_GEARBOX[there];

    const next = BOARD_LAYOUT[this.currentIndex + distance];
    const isCollision = STATIC_MAP_ENTITIES[next] === GameEntity.Wall;

    const nextIdx = isCollision
      ? this.currentIndex
      : this.currentIndex + distance;
    if (isCollision) {
      console.info(`Skipped Keycode ${there}: collision detected`);
    }
    if (nextIdx !== this.currentIndex) {
      this.board[this.currentIndex].classList.remove(GameEntity.Packman);
      this.onMoved?.();
    }
    this.currentIndex = nextIdx;
    this.board[this.currentIndex].classList.add(GameEntity.Packman);
  }
}
