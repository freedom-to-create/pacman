export enum GameEntity {
  Packman = 'pacman',
  Cookie = 'cookie',
  Wall = 'wall',
  Empty = 'empty_cell',
  Ghost = 'ghost',
}

export type BoardElement = 0 | 1 | 2;

export enum Direction {
  Up = 38,
  Down = 40,
  Left = 37,
  Right = 39,
}
