import * as R from 'ramda';
import { Game } from './connect4.definitions';
import { toPlayerColor, turn } from './player';

const toString = ({ board }: Game) => {
  return board
    .map((columns) => columns.map(({ player }) => player ?? '0').join('|'))
    .join('\n');
};

const toHistory = (game: Game) =>
  R.flow(game, [
    R.prop('history'),
    R.reverse,
    R.pluck('player'),
    R.splitEvery(10),
    R.map(R.join(',')),
    R.join(',\n         |  '),
  ]);

const toError = ({ error }: Game) => {
  if (!error) {
    return;
  }

  return `${error.name}: ${error.message}`;
};

const toWinner = ({ winner }: Game) => {
  if (!winner) {
    return;
  }

  const { cursor, direction, data } = winner;
  const { player, vector } = cursor;

  const sequence = R.pluck('vector', data).join(' -> ');

  return `(${player}) ${toPlayerColor(player)} WINS,
         | ${direction}(${sequence})`;
};

export const render = (game: Game) => {
  const board = toString(game);
  const history = toHistory(game);
  const player = turn(game);

  const winner = toWinner(game);
  const error = toError(game);
  const who = `(${player}) ${toPlayerColor(player)} MOVES NEXT`;

  return `
${board}

------------------------------------------------------------
STATUS:  | ${winner ?? error ?? who};
------------------------------------------------------------
HISTORY: | (${game.history.length}) Array<
         |  ${history}
         | >;
`;
};
