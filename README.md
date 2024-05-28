# Connect4

- <https://en.wikipedia.org/wiki/Connect_Four>

## Deployment

- <https://hitmands.github.io/connect4>

## Rules

- Two players take turns to drop a disc into a 7x6 grid.
- The disc falls to the lowest available position within the column.
- The first player to form a horizontal, vertical, or diagonal line of four discs wins.
- The game is a draw if the grid is full and no player has won.

## Implementation

- The draw is checked based on the history length (max 42 moves).
- The winner is only checked after the 7th move.
- The winner is checked on the last move, not entire walk through of the matrix.
