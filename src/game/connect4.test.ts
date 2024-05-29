import * as R from 'ramda';
import { describe, expect, it, test } from 'vitest';
import { connect4 } from './connect4';
import { Cell, Game } from './connect4.definitions';
import { createGame } from './init';
import { createPlayer, turn } from './player';

describe('Initializing the Game', () => {
  it('should draw a 6 rows by 7 columns empty board', () => {
    const game = createGame();

    expect(game.board).toHaveLength(6);
    expect(game.board).toSatisfy<Game['board']>((columns) =>
      columns.every((column) => column.length === 7),
    );

    expect(R.flow(game, [connect4(), R.toString])).toMatchInlineSnapshot(`
      "
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0

      ------------------------------------------------------------
      STATUS:  | (+) RED MOVES NEXT;
      ------------------------------------------------------------
      HISTORY: | (0) Array<
               |  
               | >;
      "
    `);
  });

  it('should allow the red (+) the first move', () => {
    const game = createGame();

    expect(turn(game)).toEqual('+');
  });

  it('should initialize with an empty history', () => {
    const game = createGame();

    expect(game).toHaveProperty('history', []);
  });

  it('should initialize without a winner', () => {
    const game = createGame();

    expect(game).not.toHaveProperty('winner');
  });

  it('should initialize without an error', () => {
    const game = createGame();

    expect(game).not.toHaveProperty('error');
  });

  it('should contain a board of empty cells', () => {
    const game = createGame();

    expect(game).toHaveProperty('board');

    const assertion = ({ vector, player }: Cell) => {
      expect(player).toBeNull();

      // as indexes are 0-based
      const [x, y] = vector;

      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(6);

      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThan(7);
    };

    game.board.forEach((col) => col.forEach(assertion));
  });
});

describe('Playing the Game', () => {
  it('should only allow the red to move first', () => {
    const game = createGame();
    const red = createPlayer('+');
    const yellow = createPlayer('-');

    // The move is ignored
    const invalid = connect4(yellow(5));
    expect(invalid(game).toString()).toMatchInlineSnapshot(`
      "
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0

      ------------------------------------------------------------
      STATUS:  | TypeError: It's not YELLOW's (-) turn;
      ------------------------------------------------------------
      HISTORY: | (0) Array<
               |  
               | >;
      "
    `);

    const valid = connect4(red(5));
    expect(valid(game).toString()).toMatchInlineSnapshot(`
      "
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|+|0

      ------------------------------------------------------------
      STATUS:  | (-) YELLOW MOVES NEXT;
      ------------------------------------------------------------
      HISTORY: | (1) Array<
               |  +
               | >;
      "
    `);
  });

  it('should allow pins to take the first available slot', () => {
    const game = createGame();
    const red = createPlayer('+');
    const yellow = createPlayer('-');

    const spec = connect4(
      red(5),
      yellow(5),
      red(4),
      yellow(5),
      red(4),
      yellow(3),
    );

    expect(spec(game).toString()).toMatchInlineSnapshot(`
      "
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|-|0
      0|0|0|0|+|-|0
      0|0|0|-|+|+|0

      ------------------------------------------------------------
      STATUS:  | (+) RED MOVES NEXT;
      ------------------------------------------------------------
      HISTORY: | (6) Array<
               |  +,-,+,-,+,-
               | >;
      "
    `);
  });

  it('should prevent the same player from playing twice in a row', () => {
    const game = createGame();
    const red = createPlayer('+');

    const spec = connect4(red(5), red(4));

    // The second move should be ignored
    expect(spec(game).toString()).toMatchInlineSnapshot(`
      "
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|+|0

      ------------------------------------------------------------
      STATUS:  | TypeError: It's not RED's (+) turn;
      ------------------------------------------------------------
      HISTORY: | (1) Array<
               |  +
               | >;
      "
    `);
  });

  it('should prevent a pin from being dropped on a full column', () => {
    const game = createGame();
    const red = createPlayer('+');
    const yellow = createPlayer('-');

    const spec = connect4(
      red(4),
      yellow(4),
      red(4),
      yellow(4),
      red(4),
      yellow(4),
      /* invalid */ red(4),
      /* ignored */ yellow(5),
    );

    expect(spec(game).toString()).toMatchInlineSnapshot(`
      "
      0|0|0|0|-|0|0
      0|0|0|0|+|0|0
      0|0|0|0|-|0|0
      0|0|0|0|+|0|0
      0|0|0|0|-|0|0
      0|0|0|0|+|0|0

      ------------------------------------------------------------
      STATUS:  | RangeError: Column "4" is full;
      ------------------------------------------------------------
      HISTORY: | (6) Array<
               |  +,-,+,-,+,-
               | >;
      "
    `);
  });
});

describe('Winning the Game', () => {
  it('should declare red the winner (5V)', () => {
    const game = createGame();
    const red = createPlayer('+');
    const yellow = createPlayer('-');

    const spec = connect4(
      red(5),
      yellow(3),
      red(5),
      yellow(3),
      red(5),
      yellow(2),
      red(5),
    );

    expect(spec(game).toString()).toMatchInlineSnapshot(`
      "
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|+|0
      0|0|0|0|0|+|0
      0|0|0|-|0|+|0
      0|0|-|-|0|+|0

      ------------------------------------------------------------
      STATUS:  | (+) RED WINS,
               | Vertical(2,5 -> 3,5 -> 4,5 -> 5,5);
      ------------------------------------------------------------
      HISTORY: | (7) Array<
               |  +,-,+,-,+,-,+
               | >;
      "
    `);
  });

  it('should declare yellow the winner (0H)', () => {
    const game = createGame();
    const red = createPlayer('+');
    const yellow = createPlayer('-');

    const spec = connect4(
      red(0),
      yellow(2),
      red(1),
      yellow(3),
      red(3),
      yellow(4),
      red(3),
      yellow(5),
    );

    expect(spec(game).toString()).toMatchInlineSnapshot(`
      "
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|+|0|0|0
      0|0|0|+|0|0|0
      +|+|-|-|-|-|0

      ------------------------------------------------------------
      STATUS:  | (-) YELLOW WINS,
               | Horizontal(5,2 -> 5,3 -> 5,4 -> 5,5);
      ------------------------------------------------------------
      HISTORY: | (8) Array<
               |  +,-,+,-,+,-,+,-
               | >;
      "
    `);
  });

  it('should declare yellow the winner (1LD)', () => {
    const game = createGame();
    const red = createPlayer('+');
    const yellow = createPlayer('-');

    const spec = connect4(
      red(0),
      yellow(1),
      red(2),
      yellow(2),
      red(3),
      yellow(4),
      red(3),
      yellow(3),
      red(4),
      yellow(4),
      red(5),
      yellow(4),
    );

    expect(spec(game).toString()).toMatchInlineSnapshot(`
      "
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      0|0|0|0|-|0|0
      0|0|0|-|-|0|0
      0|0|-|+|+|0|0
      +|-|+|+|-|+|0

      ------------------------------------------------------------
      STATUS:  | (-) YELLOW WINS,
               | CounterDiagonal(2,4 -> 3,3 -> 4,2 -> 5,1);
      ------------------------------------------------------------
      HISTORY: | (12) Array<
               |  +,-,+,-,+,-,+,-,+,-,
               |  +,-
               | >;
      "
    `);
  });

  it('should declare red the winner (0CD)', () => {
    const game = createGame();
    const red = createPlayer('+');
    const yellow = createPlayer('-');

    const spec = connect4(
      red(0),
      yellow(0),
      red(1),
      yellow(0),
      red(0),
      yellow(1),
      red(2),
      yellow(5),
      red(1),
      yellow(5),
      red(3),
    );

    expect(spec(game).toString()).toMatchInlineSnapshot(`
      "
      0|0|0|0|0|0|0
      0|0|0|0|0|0|0
      +|0|0|0|0|0|0
      -|+|0|0|0|0|0
      -|-|0|0|0|-|0
      +|+|+|+|0|-|0

      ------------------------------------------------------------
      STATUS:  | (+) RED WINS,
               | Horizontal(5,0 -> 5,1 -> 5,2 -> 5,3);
      ------------------------------------------------------------
      HISTORY: | (11) Array<
               |  +,-,+,-,+,-,+,-,+,-,
               |  +
               | >;
      "
    `);
  });
});

describe('Drawing the Game', () => {
  it('should declare it a draw', () => {
    const game = createGame();
    const red = createPlayer('+');
    const yellow = createPlayer('-');

    const spec = connect4(
      red(0),
      yellow(0),
      red(0),
      yellow(0),
      red(0),
      yellow(0),

      red(1),
      yellow(1),
      red(1),
      yellow(1),
      red(1),
      yellow(1),

      red(3),
      yellow(2),
      red(2),
      yellow(2),
      red(2),
      yellow(2),

      red(4),
      yellow(2),
      red(3),
      yellow(3),
      red(3),
      yellow(3),

      red(3),
      yellow(4),
      red(4),
      yellow(4),
      red(5),
      yellow(5),

      red(4),
      yellow(4),
      red(5),
      yellow(5),
      red(5),
      yellow(6),
      red(5),
      yellow(6),
      red(6),
      yellow(6),
      red(6),
      yellow(6),
      red(6),
    );

    expect(spec(game).toString()).toMatchInlineSnapshot(`
      "
      -|-|-|+|-|+|-
      +|+|-|-|+|+|+
      -|-|+|+|-|-|-
      +|+|-|-|+|+|+
      -|-|+|+|-|-|-
      +|+|-|+|+|+|-

      ------------------------------------------------------------
      STATUS:  | RangeError: DRAW;
      ------------------------------------------------------------
      HISTORY: | (42) Array<
               |  +,-,+,-,+,-,+,-,+,-,
               |  +,-,+,-,+,-,+,-,+,-,
               |  +,-,+,-,+,-,+,-,+,-,
               |  +,-,+,-,+,-,+,-,+,-,
               |  +,-
               | >;
      "
    `);
  });
});

describe('fixtures', async () => {
  const { default: fixtures } = await import('./fixtures.json');

  const table = test.each(fixtures);

  table('%#', ({ moves }) => {
    const game = createGame();
    const red = createPlayer('+');
    const yellow = createPlayer('-');

    const spec = connect4(
      ...moves.map((col, i) => (i % 2 === 0 ? red : yellow)(col)),
    );

    expect(spec(game).toString()).toMatchSnapshot();
  });
});
