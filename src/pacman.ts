import {
  BOARD_SIZE,
  BOARD_LAYOUT,
  PACMAN_INITIAL_LOCATION,
  BLINKY,
  CLYDE,
  INKY,
  PINKY,
  MAP_ENTITIES,
} from './constants';
import { goTo } from './movements';
import { GameEntity, Direction } from './types';

let curPacmanIndex = PACMAN_INITIAL_LOCATION;

document.addEventListener('DOMContentLoaded', () => {
  const boardDOMElement = document.querySelector('.board');
  const scoreDisplay = document.querySelector('.score');

  let cookiesLeft = 0;

  const elements = Array<Element>(BOARD_LAYOUT.length);
  (function createBoard() {
    if (!boardDOMElement) {
      return console.error('Root DOM Element cannot be null!');
    }
    BOARD_LAYOUT.forEach((field, idx) => {
      const element = document.createElement('div');
      element.classList.add(MAP_ENTITIES[field]);
      boardDOMElement.appendChild(element);
      elements[idx] = element;
      if (MAP_ENTITIES[field] === GameEntity.Cookie) {
        cookiesLeft++;
      }
    });
  })();

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
  }

  const ghosts = [
    new Ghost(BLINKY),
    new Ghost(PINKY),
    new Ghost(INKY),
    new Ghost(CLYDE),
  ];

  ghosts.forEach((ghost) => {
    elements[ghost.currentIndex].classList.add(ghost.className);
    elements[ghost.currentIndex].classList.add(GameEntity.Ghost);
  });

  ghosts.forEach((ghost) => moveGhost(ghost));

  function moveGhost(ghost: Ghost) {
    const directions = [-1, +1, BOARD_SIZE, -BOARD_SIZE];
    let direction = directions[Math.floor(Math.random() * directions.length)];

    ghost.timerId = setInterval(function () {
      if (
        !elements[ghost.currentIndex + direction].classList.contains(
          GameEntity.Ghost
        ) &&
        !elements[ghost.currentIndex + direction].classList.contains(
          GameEntity.Wall
        )
      ) {
        elements[ghost.currentIndex].classList.remove(
          ghost.className,
          GameEntity.Ghost
        );
        ghost.currentIndex += direction;
        elements[ghost.currentIndex].classList.add(
          ghost.className,
          GameEntity.Ghost
        );
      } else {
        direction = directions[Math.floor(Math.random() * directions.length)];
      }
      checkForGameOver();
    }, ghost.speed);
  }

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
