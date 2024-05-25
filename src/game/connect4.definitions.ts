export type Player = '+' | '-';

export type Vector = [number, number];

export type Cell = {
  player: Player | null;
  vector: Vector;
  date?: Date;
};

export type Sequence = {
  direction: string;
  cursor: Cell;
  data: Cell[];
};

export type Game = {
  /**
   * The 6x7 Matrix
   */
  board: Cell[][];

  /**
   * The winning Sequence
   */
  winner?: Sequence;

  /**
   * The error occurred
   */
  error?: Error;

  /**
   * The moves history in reverse chronological order,
   * i.e., the last move is the first element
   */
  history: Cell[];

  toString(): string;
};

export type Move = (game: Game) => Game;
