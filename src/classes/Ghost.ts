import { Tile } from '../pathfinding';
import { GameEntity } from '../commonTypes';

type GhostConstructorParams = {
  ghostParams: {
    className: string;
    startIndex: number;
    speed: number;
  };
  board: Element[];
  onMoved?: () => void;
};

export class Ghost {
  private className;
  private startIndex;
  private speed;
  currentIndex;
  private timerId: NodeJS.Timeout | number = NaN;
  private board;
  private track: Tile[] = [];
  private onMoved;
  clearTimers() {
    clearInterval(this.timerId);
  }
  setTrack(track: Tile[]) {
    this.track = [...track];
    // drawPath(this);
  }

  private followTrack() {
    this.timerId = setInterval(() => {
      const nextTile = this.track.pop();
      if (
        !nextTile ||
        this.board[nextTile.idx].classList.contains(GameEntity.Ghost)
      ) {
        return;
      }
      this.board[this.currentIndex].classList.remove(
        this.className,
        GameEntity.Ghost
      );
      this.currentIndex = nextTile.idx;
      this.board[this.currentIndex].classList.add(
        this.className,
        GameEntity.Ghost
      );
      this.onMoved?.();
    }, this.speed);
  }
  constructor({
    ghostParams: { className, startIndex, speed },
    board,
    onMoved,
  }: GhostConstructorParams) {
    this.className = className;
    this.startIndex = startIndex;
    this.currentIndex = startIndex;
    this.speed = speed;
    this.board = board;
    board[this.currentIndex].classList.add(this.className);
    board[this.currentIndex].classList.add(GameEntity.Ghost);
    this.followTrack();
    this.onMoved = onMoved;
  }
}
