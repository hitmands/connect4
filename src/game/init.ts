import { Cell, Game } from './connect4.definitions';
import { render } from './render';

export const toEmptyCell = (vector: Cell['vector']): Cell => ({
  player: null,
  vector,
});

export const toEmptyBoard = (): Game['board'] =>
  Array.from({ length: 6 }, (_, x) =>
    Array.from({ length: 7 }, (__, y) => toEmptyCell([x, y])),
  );

export const createGame = (): Game => ({
  history: [],
  board: toEmptyBoard(),
  toString() {
    return render(this);
  },
});
