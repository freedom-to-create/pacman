import { DIRECTION_GEARBOX, STATIC_MAP_ENTITIES } from './constants';
import { BoardElement, GameEntity } from './commonTypes';

export interface PathFinder {
  (fromIdx: number, toIdx: number): Tile[];
}

type MovementsGraph = Record<string, Tile | null>;

export class Tile {
  idx;
  constructor(idx: number) {
    this.idx = idx;
  }
}

export class Grid {
  private nodes;

  private init(gameGrid: BoardElement[]) {
    return gameGrid.reduce<MovementsGraph>(
      (res, el, idx) =>
        STATIC_MAP_ENTITIES[el] === GameEntity.Wall
          ? res
          : { ...res, [idx]: new Tile(idx) },
      {}
    );
  }

  getNeighbors(node: Tile): (Tile | undefined | null)[] {
    return Object.values(DIRECTION_GEARBOX).map((direction) => {
      return this.nodes[direction + node.idx];
    });
  }

  constructor(map: BoardElement[]) {
    this.nodes = this.init(map);
  }
}

// Breadth First Search on Graphs pathfinding algorithm
export function createPathFinder(grid: Grid) {
  return (fromIdx: number, toIdx: number) => {
    const frontier = [new Tile(fromIdx)];

    const cameFrom: MovementsGraph = { [fromIdx]: null };

    // TODO: refactor to Queue
    for (let current = frontier.shift(); current; current = frontier.shift()) {
      for (const neighbor of grid.getNeighbors(current)) {
        if (neighbor && cameFrom[neighbor.idx] === undefined) {
          frontier.push(neighbor);
          cameFrom[neighbor.idx] = current;
        }
      }
    }

    console.log('Graph of Tiles: ');
    console.dir(
      Object.entries(cameFrom).reduce(
        (acc, [idx, node]) => ({
          ...acc,
          [idx]: {
            to: document.querySelector(`[data-idx='${idx}']`),
            from: document.querySelector(`[data-idx='${node?.idx}']`),
            fromIdx: node?.idx,
          },
        }),
        {}
      )
    );

    const path = [new Tile(toIdx)];
    let currentTile = cameFrom[toIdx];

    while (currentTile && currentTile.idx !== fromIdx) {
      path.push(currentTile);
      currentTile = cameFrom[currentTile.idx];
    }

    return path;
  };
}
