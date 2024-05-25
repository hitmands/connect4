import * as R from 'ramda';
import { Cell, Game, Player, Vector } from './connect4.definitions';

export const invalid = R.assoc('error');

export const toPlayerColor = (p: unknown) => (p === '+' ? 'RED' : 'YELLOW');

export const turn = ({ history }: Game) =>
  history.length % 2 === 0 ? '+' : '-';

const findClosestAvailableVector = (column: number, { board }: Game) => {
  const x = board.findLastIndex((columns) => !columns[column].player);

  return x >= 0 ? ([x, column] as Vector) : undefined;
};

export const createPlayer =
  (player: Player) =>
  (column: number) =>
  (game: Game): Game => {
    if (game.winner || game.error) {
      return game;
    }

    if (turn(game) !== player) {
      const error = new TypeError(
        `It's not ${toPlayerColor(player)}'s (${player}) turn`,
      );

      return invalid(error, game);
    }

    const vector = findClosestAvailableVector(column, game);

    if (!vector) {
      const error = new RangeError(`Column "${column}" is full`);

      return invalid(error, game);
    }

    const cursor: Cell = {
      player,
      vector,
      date: new Date(),
    };

    return R.flow(game, [
      R.assocPath(['board', ...vector, 'player'], player),
      R.modify('history', R.prepend(cursor)),
    ]);
  };
