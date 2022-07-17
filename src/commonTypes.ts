export enum GameEntity {
  Packman = 'pacman',
  Cookie = 'cookie',
  Wall = 'wall',
  Empty = 'empty_cell',
  Ghost = 'ghost',
}

export enum Direction {
  Up = 38,
  Down = 40,
  Left = 37,
  Right = 39,
}

export type BoardElement = 0 | 1 | 2;
