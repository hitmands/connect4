import * as R from 'ramda';
import { invalid } from './player';
import { toSequences } from './sequences';
import { Game, Sequence } from './connect4.definitions';

export const isDraw = (game: Game) => game.history.length === 42;

const findWinningSequence = (sequences?: Sequence[]) =>
  sequences?.find((sequence) => sequence.data.length >= 4);

export const evaluate = (game: Game) => {
  if (game.winner || game.error) {
    return game;
  }

  const [cursor] = game.history;

  const sequences = toSequences(cursor, game);
  const winner = findWinningSequence(sequences);

  if (winner) {
    return R.assoc('winner', winner, game);
  }

  if (isDraw(game)) {
    return invalid(new RangeError('DRAW'), game);
  }

  return game;
};
