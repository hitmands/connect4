import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import type { Game as IGame, Cell } from '../game';
import { useIsWinningCell } from './use-is-winning-cell';

type Props = {
  game: IGame;
  onMove: (column: number) => void;
};

const Board = styled.section`
  display: inline-grid;
  grid-template-columns: repeat(7, 100px);
  grid-template-rows: repeat(6, 100px);
  gap: 0.5rem;
  background-color: paleturquoise;
  padding: 2rem;
  border-radius: 0.5rem;
  margin-right: 2rem;
  border: 1px solid darkcyan;

  [data-is-game-over='true'] & {
    pointer-events: none;
  }
`;

const Cell = styled.button`
  all: unset;
  width: 100px;
  height: 100px;
  background-color: white;
  border: 1px solid darkgrey;
  border-radius: 100px;
  transition: 100ms border-color linear;
  text-align: center;
  box-shadow: inset 0 0 5px black;
  user-select: none;

  &[data-player='null'] {
    &:hover {
      border-color: black;
      cursor: pointer;
    }

    &:active {
      box-shadow: inset 0 0 6px black;
    }
  }

  &[data-player='+'] {
    background-color: palevioletred;
  }

  &[data-player='-'] {
    background-color: palegoldenrod;
  }

  @keyframes WinningCell {
    0% {
      box-shadow: inset 0 0 6px black;
    }
    50% {
      box-shadow: inset 0 0 15px black;
    }
    99% {
      box-shadow: inset 0 0 7px black;
    }
  }

  &[data-is-on-winning-seq='true'] {
    animation: WinningCell 500ms infinite;
  }
`;

export const Game: FC<Props> = ({ game, onMove }) => {
  const onColumnClick = useCallback((y: number) => () => onMove(y), [onMove]);
  const isWinningCell = useIsWinningCell(game);

  return (
    <Board>
      {game.board.map((row, x) =>
        row.map((cell, y) => (
          <Cell
            key={`cell-${x}-${y}`}
            data-cell-x={x}
            data-cell-y={y}
            data-player={`${cell.player}`}
            data-is-on-winning-seq={isWinningCell(cell)}
            onClick={onColumnClick(y)}
          >
            {cell.player}
          </Cell>
        )),
      )}
    </Board>
  );
};
