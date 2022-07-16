import {
  BOARD_LAYOUT,
  PACMAN_INITIAL_LOCATION,
  BLINKY,
  CLYDE,
  INKY,
  PINKY,
  STATIC_MAP_ENTITIES,
} from './constants';
import { goTo } from './movements';
import { findPath, MovementsGraph, Node } from './pathfinding';
import { GameEntity, Direction } from './types';

const GRAPH = new MovementsGraph(BOARD_LAYOUT);

let curPacmanIndex = PACMAN_INITIAL_LOCATION;

document.addEventListener('DOMContentLoaded', () => {
  const boardDOMElement = document.querySelector('.board');
  const scoreDisplay = document.querySelector('.score');

  let cookiesLeft = 0;

  // TODO: may be be refactored as elements = initBoard();
  const elements = Array<Element>(BOARD_LAYOUT.length);
  (function initBoard() {
    if (!boardDOMElement) {
      return console.error('Root DOM Element cannot be null!');
    }
    BOARD_LAYOUT.forEach((element, idx) => {
      const domNode = document.createElement('div');
      domNode.classList.add(STATIC_MAP_ENTITIES[element]);
      domNode.dataset.idx = String(idx);
      boardDOMElement.appendChild(domNode);
      elements[idx] = domNode;
      if (STATIC_MAP_ENTITIES[element] === GameEntity.Cookie) {
        cookiesLeft++;
      }
    });
  })();

  // init Pacman
  elements[curPacmanIndex].classList.add(GameEntity.Packman);

  function movePacman({ keyCode }: { keyCode: Direction }) {
    const nextPacmanIdx = goTo(keyCode, curPacmanIndex);
    if (nextPacmanIdx !== curPacmanIndex) {
      elements[curPacmanIndex].classList.remove(GameEntity.Packman);
    }
    curPacmanIndex = nextPacmanIdx;

    elements[curPacmanIndex].classList.add(GameEntity.Packman);
    pacDotEaten();
    checkForGameOver();
    checkForVictory();
  }
  document.addEventListener('keyup', movePacman);

  function drawPath(ghost: Ghost) {
    const path = findPath(GRAPH, ghost.currentIndex, curPacmanIndex);
    // console.log('Path: ', path);
    path
      .map(({ idx }) => document.querySelector(`[data-idx='${idx}']`))
      .reduce((promise, node) => {
        return promise.then(() => {
          return new Promise((resolve) => {
            setTimeout(() => {
              const el = document.createElement('div');
              el.classList.add('path', `${ghost.className}_path`);
              node?.appendChild(el);
              resolve(undefined);
            }, 25);
          });
        });
      }, Promise.resolve());
  }

  function pacDotEaten() {
    if (elements[curPacmanIndex].classList.contains(GameEntity.Cookie)) {
      elements[curPacmanIndex].classList.remove(GameEntity.Cookie);
      if (scoreDisplay) {
        cookiesLeft--;
        scoreDisplay.innerHTML = `Cookies left: ${cookiesLeft}`;
      }
    }
  }

  class Ghost {
    className;
    startIndex;
    speed;
    currentIndex;
    timerId: NodeJS.Timeout | number;
    private track: Node[] = [];
    constructor({
      className,
      startIndex,
      speed,
    }: {
      className: string;
      startIndex: number;
      speed: number;
    }) {
      this.className = className;
      this.startIndex = startIndex;
      this.speed = speed;
      this.currentIndex = startIndex;
      this.timerId = NaN;
    }

    setTrack(track: Node[]) {
      this.track = [...track];
      // drawPath(this);
    }

    followTrack() {
      setInterval(() => {
        const nextTile = this.track.pop();
        if (
          !nextTile ||
          elements[nextTile.idx].classList.contains(GameEntity.Ghost)
        ) {
          return;
        }
        elements[this.currentIndex].classList.remove(
          this.className,
          GameEntity.Ghost
        );
        this.currentIndex = nextTile.idx;
        elements[this.currentIndex].classList.add(
          this.className,
          GameEntity.Ghost
        );
      }, this.speed);
    }
  }

  // init ghosts
  const ghosts = [
    new Ghost(BLINKY),
    new Ghost(PINKY),
    new Ghost(INKY),
    new Ghost(CLYDE),
  ];

  //TODO: move map init
  ghosts.forEach((ghost) => {
    elements[ghost.currentIndex].classList.add(ghost.className);
    elements[ghost.currentIndex].classList.add(GameEntity.Ghost);
    ghost.followTrack();
    // drawPath(ghost);
    ghost.setTrack(findPath(GRAPH, ghost.currentIndex, curPacmanIndex));
    document.addEventListener('keyup', () =>
      ghost.setTrack(findPath(GRAPH, ghost.currentIndex, curPacmanIndex))
    );
  });

  // maybe move to ghost init
  // ghosts.forEach((ghost) => moveGhost(ghost));

  function clearTimers() {
    ghosts.forEach((ghost) => clearInterval(ghost.timerId));
    document.removeEventListener('keyup', movePacman);
  }

  function checkForGameOver() {
    if (elements[curPacmanIndex].classList.contains(GameEntity.Ghost)) {
      clearTimers();
      console.info('Game Over');
    }
  }

  function checkForVictory() {
    if (cookiesLeft <= 0) {
      clearTimers();
      console.info('You have WON!');
    }
  }
});
