import {
  DIRECTION_GEARBOX,
  EMPTY_PATH_COST,
  STATIC_MAP_ENTITIES,
} from './constants';
import { BoardElement, GameEntity } from './types';

export class Node {
  idx;
  cost;
  constructor(idx: number, cost: number) {
    this.idx = idx;
    this.cost = cost;
  }
}

export class MovementsGraph {
  private nodes;

  private init(gameGrid: BoardElement[]) {
    return gameGrid.reduce<Record<string, Node | undefined>>(
      (res, el, idx) =>
        STATIC_MAP_ENTITIES[el] === GameEntity.Wall
          ? res
          : { ...res, [idx]: new Node(idx, gameGrid[idx]) },
      {}
    );
  }

  getNodes() {
    return Object.values(this.nodes);
  }

  getNeighbors(node: Node) {
    return Object.values(DIRECTION_GEARBOX).map((direction) => {
      return this.nodes[direction + node.idx];
    });
  }

  getStepCost(next: Node) {
    return next.cost;
  }

  constructor(map: BoardElement[]) {
    this.nodes = this.init(map);
  }
}

function getHeuristic(a: Node, b: Node) {
  return Math.abs(a.idx - b.idx);
}

export function findPath(
  graph: MovementsGraph,
  fromIdx: number,
  toIdx: number
) {
  const fromNode = new Node(fromIdx, EMPTY_PATH_COST);
  const frontier = [fromNode];

  const cameFrom: Record<string, Node | null> = { [fromIdx]: null };

  // TODO: refactor to Queue
  for (let current = frontier.shift(); current; current = frontier.shift()) {
    for (const neighbor of graph.getNeighbors(current)) {
      if (neighbor && cameFrom[neighbor.idx] === undefined) {
        frontier.push(neighbor);
        cameFrom[neighbor.idx] = current;
      }
    }
  }

  // console.log('Graph: ');
  // console.dir(
  //   Object.entries(cameFrom).reduce(
  //     (acc, [idx, node]) => ({
  //       ...acc,
  //       [idx]: {
  //         to: document.querySelector(`[data-idx='${idx}']`),
  //         from: document.querySelector(`[data-idx='${node?.idx}']`),
  //         fromIdx: node?.idx,
  //       },
  //     }),
  //     {}
  //   )
  // );

  const path = [];
  let currentNode = cameFrom[toIdx];

  while (currentNode && currentNode.idx !== fromIdx) {
    path.push(currentNode);
    currentNode = cameFrom[currentNode.idx];
  }

  return path;
}
