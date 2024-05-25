import React, { type FC, useMemo } from 'react';
import styled from 'styled-components';
import { type Game } from '../game';

type Props = {
  game: Game;
};

const Pre = styled.pre`
  font-size: 0.8rem;
`;

export const Debugger: FC<Props> = ({ game }) => {
  const code = useMemo(() => game.toString(), [game]);

  return (
    <Pre>
      <code>{code}</code>
    </Pre>
  );
};
