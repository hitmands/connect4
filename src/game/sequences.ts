import { Cell, Game, Player, Sequence, Vector } from './connect4.definitions';

const compass = ([bx, by]: Vector, [fx, fy]: Vector) => {
  const backward = ({ vector, player }: Cell, game: Game): Cell[] => {
    const [x, y] = vector;

    const $x = x + bx;
    const $y = y + by;

    const cell = game.board?.[$x]?.[$y];

    if (cell?.player !== player) {
      return [];
    }

    return backward(cell, game).concat(cell);
  };

  const forward = ({ vector, player }: Cell, game: Game): Cell[] => {
    const [x, y] = vector;

    const $x = x + fx;
    const $y = y + fy;

    const cell = game.board?.[$x]?.[$y];

    if (cell?.player !== player) {
      return [];
    }

    return [cell].concat(forward(cell, game));
  };

  return (cursor: Cell, game: Game) =>
    backward(cursor, game).concat(cursor, forward(cursor, game));
};

const vertical = compass([-1, 0], [1, 0]);
const horizontal = compass([0, -1], [0, 1]);
const leadDiagonal = compass([-1, -1], [1, 1]);
const counterDiagonal = compass([-1, 1], [1, -1]);

export const toSequences = (cursor: Cell, game: Game) => {
  // There cannot be any 4-in-a-row sequences
  // for less than 7 moves
  if (game.history.length < 7) {
    return;
  }

  const y = {
    cursor,
    direction: 'Vertical',
    data: vertical(cursor, game),
  };

  const x = {
    cursor,
    direction: 'Horizontal',
    data: horizontal(cursor, game),
  };

  const ld = {
    cursor,
    direction: 'LeadDiagonal',
    data: leadDiagonal(cursor, game),
  };

  const cd = {
    cursor,
    direction: 'CounterDiagonal',
    data: counterDiagonal(cursor, game),
  };

  return [y, x, ld, cd];
};
