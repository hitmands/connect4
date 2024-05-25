import * as R from 'ramda';
import { useCallback, useMemo } from 'react';
import { Cell, Game } from '../game';

const toHash = ({ player, vector }: Cell) => `${player}-${vector}`;

const toDict = R.pipe(
  R.defaultTo([]),
  R.reduce((res, cell: Cell) => R.assoc(toHash(cell), true, res), {}),
);

export const useIsWinningCell = ({ winner }: Game) => {
  const dict = useMemo(() => toDict(winner?.data), [winner?.data]);

  return useCallback((cell: Cell) => R.has(toHash(cell), dict), [dict]);
};
