import {
  BOARD_CELL_WIDTH,
  BOARD_LAYOUT,
  GameEntity,
  KeyCode,
  MAX_SCORE,
  PACMAN_INITIAL_LOCATION,
} from './constants';

document.addEventListener('DOMContentLoaded', () => {
  const boardDOMElement = document.querySelector('.board');
  const scoreDisplay = document.getElementById('score');
  let score = 0;
  const elements = Array<Element>(BOARD_LAYOUT.length);

  (function createBoard() {
    if (!boardDOMElement) {
      return console.error('Root DOM Element cannot be null!');
    }
    BOARD_LAYOUT.forEach((field, idx) => {
      const element = document.createElement('div');
      const gameEntity = [
        GameEntity.Cookie,
        GameEntity.Wall,
        GameEntity.GhostsLair,
        GameEntity.Empty,
      ][field];
      element.classList.add(gameEntity);
      boardDOMElement.appendChild(element);
      elements[idx] = element;
    });
  })();

  let pacmanCurrentIndex = PACMAN_INITIAL_LOCATION;
  elements[pacmanCurrentIndex].classList.add(GameEntity.Packman);
  //get the coordinates of pacman on the grid with X and Y axis
  // function getCoordinates(index) {
  //   return [index % width, Math.floor(index / width)]
  // }

  // console.log(getCoordinates(pacmanCurrentIndex))

  function movePacman(e: KeyboardEvent) {
    elements[pacmanCurrentIndex].classList.remove('pac-man');
    switch (e.keyCode) {
      case KeyCode.Left:
        if (
          pacmanCurrentIndex % BOARD_CELL_WIDTH !== 0 &&
          !elements[pacmanCurrentIndex - 1].classList.contains(
            GameEntity.Wall,
          ) &&
          !elements[pacmanCurrentIndex - 1].classList.contains('ghost-lair')
        )
          pacmanCurrentIndex -= 1;
        if (elements[pacmanCurrentIndex - 1] === elements[363]) {
          pacmanCurrentIndex = 391;
        }
        break;
      case KeyCode.Up:
        if (
          pacmanCurrentIndex - BOARD_CELL_WIDTH >= 0 &&
          !elements[pacmanCurrentIndex - BOARD_CELL_WIDTH].classList.contains(
            GameEntity.Wall,
          ) &&
          !elements[pacmanCurrentIndex - BOARD_CELL_WIDTH].classList.contains(
            GameEntity.GhostsLair,
          )
        )
          pacmanCurrentIndex -= BOARD_CELL_WIDTH;
        break;
      case KeyCode.Right:
        if (
          pacmanCurrentIndex % BOARD_CELL_WIDTH < BOARD_CELL_WIDTH - 1 &&
          !elements[pacmanCurrentIndex + 1].classList.contains(
            GameEntity.Wall,
          ) &&
          !elements[pacmanCurrentIndex + 1].classList.contains('ghost-lair')
        )
          pacmanCurrentIndex += 1;
        if (elements[pacmanCurrentIndex + 1] === elements[392]) {
          pacmanCurrentIndex = 364;
        }
        break;
      case KeyCode.Down:
        if (
          pacmanCurrentIndex + BOARD_CELL_WIDTH <
            BOARD_CELL_WIDTH * BOARD_CELL_WIDTH &&
          !elements[pacmanCurrentIndex + BOARD_CELL_WIDTH].classList.contains(
            GameEntity.Wall,
          ) &&
          !elements[pacmanCurrentIndex + BOARD_CELL_WIDTH].classList.contains(
            GameEntity.GhostsLair,
          )
        )
          pacmanCurrentIndex += BOARD_CELL_WIDTH;
        break;
    }
    elements[pacmanCurrentIndex].classList.add(GameEntity.Packman);
    pacDotEaten();
    checkForGameOver();
    checkForVictory();
  }
  document.addEventListener('keyup', movePacman);

  function pacDotEaten() {
    if (!scoreDisplay) {
      return;
    }
    if (elements[pacmanCurrentIndex].classList.contains(GameEntity.Cookie)) {
      score++;
      scoreDisplay.innerHTML = String(score);
      elements[pacmanCurrentIndex].classList.remove(GameEntity.Cookie);
    }
  }

  class Ghost {
    className;
    startIndex;
    speed;
    currentIndex;
    isScared;
    timerId: NodeJS.Timeout | number;
    constructor(className: string, startIndex: number, speed: number) {
      this.className = className;
      this.startIndex = startIndex;
      this.speed = speed;
      this.currentIndex = startIndex;
      this.isScared = false;
      this.timerId = NaN;
    }
  }

  const ghosts = [
    new Ghost('blinky', 348, 250),
    new Ghost('pinky', 376, 400),
    new Ghost('inky', 351, 300),
    new Ghost('clyde', 379, 500),
  ];

  ghosts.forEach((ghost) => {
    elements[ghost.currentIndex].classList.add(ghost.className);
    elements[ghost.currentIndex].classList.add(GameEntity.Ghost);
  });

  ghosts.forEach((ghost) => moveGhost(ghost));

  function moveGhost(ghost: Ghost) {
    const directions = [-1, +1, BOARD_CELL_WIDTH, -BOARD_CELL_WIDTH];
    let direction = directions[Math.floor(Math.random() * directions.length)];

    ghost.timerId = setInterval(function () {
      //if the next squre your ghost is going to go to does not have a ghost and does not have a wall
      if (
        !elements[ghost.currentIndex + direction].classList.contains(
          GameEntity.Ghost,
        ) &&
        !elements[ghost.currentIndex + direction].classList.contains(
          GameEntity.Wall,
        )
      ) {
        elements[ghost.currentIndex].classList.remove(ghost.className);
        //move into that space
        ghost.currentIndex += direction;
        elements[ghost.currentIndex].classList.add(
          ghost.className,
          GameEntity.Ghost,
        );
        //else find a new random direction ot go in
      } else {
        direction = directions[Math.floor(Math.random() * directions.length)];
      }
      checkForGameOver();
    }, ghost.speed);
  }

  function checkForGameOver() {
    if (elements[pacmanCurrentIndex].classList.contains(GameEntity.Ghost)) {
      ghosts.forEach((ghost) => clearInterval(ghost.timerId));
      document.removeEventListener('keyup', movePacman);
      setTimeout(function () {
        console.info('Game Over');
      }, 500);
    }
  }

  function checkForVictory() {
    if (score === MAX_SCORE) {
      ghosts.forEach((ghost) => clearInterval(ghost.timerId));
      document.removeEventListener('keyup', movePacman);
      setTimeout(function () {
        console.info('You have WON!');
      }, 500);
    }
  }
});
