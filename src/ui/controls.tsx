import React, { FC, useCallback } from 'react';
import styled from 'styled-components';

type Props = {
  undo: (steps: number) => void;
  reset: () => void;
};

const Container = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem 0;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
`;

const Button = styled.button`
  all: unset;
  flex: 1 1 auto;
  border-radius: 0.25rem;
  text-align: center;
  border: 1px solid #ccc;
  text-transform: uppercase;
  font-size: 0.8rem;
  padding: 0.5rem;
  cursor: pointer;
  user-select: none;

  &:active {
    background-color: #f0f0f0;
  }
`;

export const Controls: FC<Props> = ({ undo, reset }) => {
  const onUndoClick = useCallback(() => undo(1), [undo]);
  const onResetClick = useCallback(() => reset(), [reset]);

  return (
    <Container>
      <Button onClick={onUndoClick}>Undo</Button>
      <Button onClick={onResetClick}>Reset</Button>
    </Container>
  );
};
