import { BOARD_LAYOUT } from './constants';
import { Game } from './classes/Game';
import { createPathFinder, Graph } from './pathfinding';

document.addEventListener('DOMContentLoaded', () => {
  const boardRoot = document.querySelector('.board');
  const scoreDisplayRoot = document.querySelector('.score');

  if (!boardRoot) {
    return console.log(
      'Error: no root html element found. Please check your markup for roomElement with class ".board"'
    );
  }

  const pathFinder = createPathFinder(new Graph(BOARD_LAYOUT));
  new Game(boardRoot, scoreDisplayRoot, pathFinder).run();
});
