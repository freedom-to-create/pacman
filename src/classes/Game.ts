import {
  BLINKY,
  BOARD_LAYOUT,
  CLYDE,
  INKY,
  PINKY,
  STATIC_MAP_ENTITIES,
} from '../constants';
import { Ghost } from './Ghost';
import { Pacman } from './Pacman';
import { Tile } from '../pathfinding';
import { Direction, GameEntity } from '../commonTypes';

interface PathFinder {
  (fromIdx: number, toIdx: number): Tile[];
}

export class Game {
  private board: Element[] = [];
  private cookiesLeft = 0;
  private scoreDisplay;
  private pacman;
  private ghosts;
  private findPath;

  private initBoard(boardRoot: Element) {
    BOARD_LAYOUT.forEach((element, idx) => {
      const domNode = document.createElement('div');
      domNode.classList.add(STATIC_MAP_ENTITIES[element]);
      domNode.dataset.idx = String(idx);
      boardRoot.appendChild(domNode);
      this.board[idx] = domNode;
      if (STATIC_MAP_ENTITIES[element] === GameEntity.Cookie) {
        this.cookiesLeft++;
      }
    });
  }
  private checkPacDotEaten() {
    if (
      this.board[this.pacman.currentIndex].classList.contains(GameEntity.Cookie)
    ) {
      this.board[this.pacman.currentIndex].classList.remove(GameEntity.Cookie);
      if (this.scoreDisplay) {
        this.cookiesLeft--;
        this.scoreDisplay.innerHTML = `Cookies left: ${this.cookiesLeft}`;
      }
    }
  }
  private checkForGameOver() {
    if (
      this.board[this.pacman.currentIndex].classList.contains(GameEntity.Ghost)
    ) {
      this.clearSubscriptions();
      console.info('Game Over');
    }
  }
  private checkForVictory() {
    if (this.cookiesLeft <= 0) {
      this.clearSubscriptions();
      console.info('You have WON!');
    }
  }
  private checkGameStatus = () => {
    this.checkForGameOver();
    this.checkForVictory();
  };
  private movePacman = ({ keyCode }: { keyCode: Direction }) => {
    this.pacman.goTo(keyCode);
    this.checkPacDotEaten();
  };
  private updateGhostTracks = () => {
    this.ghosts.forEach((ghost) =>
      ghost.setTrack(
        this.findPath(ghost.currentIndex, this.pacman.currentIndex)
      )
    );
  };
  private clearSubscriptions() {
    this.ghosts.forEach((ghost) => ghost.clearTimers());
    document.removeEventListener('keyup', (keyCode) =>
      this.movePacman(keyCode)
    );
    document.removeEventListener('keyup', () => this.updateGhostTracks());
  }

  constructor(
    boardRoot: Element,
    scoreDisplay: Element | null,
    findPath: PathFinder
  ) {
    this.initBoard(boardRoot);
    this.scoreDisplay = scoreDisplay;
    this.pacman = new Pacman({
      board: this.board,
      onMoved: () => {
        this.checkPacDotEaten();
        this.checkGameStatus();
      },
    });
    this.ghosts = [
      new Ghost({
        ghostParams: BLINKY,
        board: this.board,
        onMoved: this.checkGameStatus,
      }),
      new Ghost({
        ghostParams: PINKY,
        board: this.board,
        onMoved: this.checkGameStatus,
      }),
      new Ghost({
        ghostParams: INKY,
        board: this.board,
        onMoved: this.checkGameStatus,
      }),
      new Ghost({
        ghostParams: CLYDE,
        board: this.board,
        onMoved: this.checkGameStatus,
      }),
    ];
    this.findPath = findPath;
    document.addEventListener('keyup', this.movePacman);
    document.addEventListener('keyup', this.updateGhostTracks);
  }
  run() {
    this.updateGhostTracks();
  }
}
