import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { Controls } from './controls';
import { Debugger } from './debugger';
import { Game } from './game';
import { useConnect4 } from './use-connect4';

const Container = styled.div`
  display: flex;
  padding: 1rem;
  justify-content: center;
`;

const Sidebar = styled.div``;

export const Connect4: FC = () => {
  const { game, drop, undo, reset } = useConnect4();

  const isGameOver = useMemo(
    () => !!(game.winner || game.error),
    [game.winner, game.error],
  );

  return (
    <Container data-is-game-over={isGameOver}>
      <Game game={game} onMove={drop} />

      <Sidebar>
        <Controls undo={undo} reset={reset} />

        <Debugger game={game} />
      </Sidebar>
    </Container>
  );
};
