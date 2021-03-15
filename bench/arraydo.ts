import { pipe } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';

const result = (numbers: number[]) =>
  pipe(
    A.Do,
    A.bind('a', () =>
      pipe(
        numbers,
        A.filter((x) => x > 0)
      )
    ),
    A.bind('b', () =>
      pipe(
        numbers,
        A.filter((x) => x < 0)
      )
    )
  );

// result([1, 2, 4, 5, -3, -5]); //?

const increment = A.ap(A.of((x: number) => x + 1));
// pipe([1, 2, 3], A.traverse(increment));
