import * as R from 'ramda';
import { Game, Move } from './connect4.definitions';
import { evaluate } from './evaluate';

export const connect4 = (...moves: Move[]) => {
  const timeline = R.chain((move: Move) => [move, evaluate], moves);

  return (game: Game): Game => R.flow(game, timeline);
};
