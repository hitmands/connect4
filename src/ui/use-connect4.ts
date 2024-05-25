import { useMemo, useState, useCallback } from 'react';
import {
  connect4,
  createGame,
  createPlayer,
  type Game,
  turn,
  undo as undoMoves,
} from '../game';

export const useConnect4 = () => {
  const red = useMemo(() => createPlayer('+'), []);
  const yellow = useMemo(() => createPlayer('-'), []);

  const [game, iteration] = useState<Game>(createGame());

  const drop = useCallback(
    (column: number) => {
      iteration(($game) => {
        const coin = turn($game) === '-' ? yellow : red;

        const timeline = connect4(coin(column));

        return timeline($game);
      });
    },
    [game],
  );

  const undo = useCallback(
    (moves = 1) => {
      return iteration((game) => undoMoves(moves, game));
    },
    [game],
  );

  const reset = useCallback(() => iteration(createGame()), []);

  return { game, drop, undo, reset };
};
