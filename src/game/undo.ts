import * as R from 'ramda';
import { Game } from './connect4.definitions';
import { isDraw } from './evaluate';
import { toEmptyCell } from './init';

export const undo = (moves = 1, game: Game): Game => {
  if (game.error) {
    const $game = R.omit(['error'], game);

    return isDraw($game) ? undo(moves, $game) : $game;
  }

  if (!moves || R.isEmpty(game.history)) {
    return game;
  }

  const [head, ...history] = game.history;

  const $game = R.flow(game, [
    R.assoc('history', history),
    R.omit(['winner']),
    R.assocPath(['board', ...head.vector], toEmptyCell(head.vector)),
  ]) as Game;

  return undo(moves - 1, $game);
};
