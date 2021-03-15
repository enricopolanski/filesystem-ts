import { Dirent } from 'fs';
import { pipe, flow, not, Refinement } from 'fp-ts/lib/function';

// const semigroupRefinement: Semigroup<Refinement<Dirent, DirentFile | DirentSymLink | DirentDirectory>> = {
//   co,
// };

// const combineRefinement: <A, B extends A, C extends A>(
//   rab: Refinement<A, B>
// ) => (rac: Refinement<A, C>) => Refinement<A, B | C> = (rab) => (rac) => (
//   a
// ) => {
//   return (rab(a) || rac(a)) ;
// };

const refinementOr = <A, B extends A>(rab: Refinement<A, B>) => <C extends A>(
  rac: Refinement<A, C>
) => (a: A): a is B | C => rab(a) || rac(a);

// function combineRefinement<A, B extends A>(
//   rab: Refinement<A, B>
// ): Refinement<A, B>;
// function combineRefinement<A, B extends A, C extends A>(
//   rab: Refinement<A, B>,
//   rac: Refinement<A, C>
// ): Refinement<A, B | C>;
// function combineRefinement<A, B extends A, C extends A, D extends A>(
//   rab: Refinement<A, B>,
//   rac: Refinement<A, C>,
//   rad: Refinement<A, D>
// ): Refinement<A, B | C | D>;

const refinementAnd = <A, B extends A>(rab: Refinement<A, B>) => <C extends A>(
  rac: Refinement<A, C>
) => (a: A): a is B & C => rab(a) && rac(a);

type Positive = number;
type Negative = number;

const isPositive = (n: number): n is Positive => n > 0;

const isNegative = (n: number): n is Negative => n < 0;

const isNotZero = (n: number): n is Positive | Negative =>
  pipe(isNegative, refinementOr(isPositive))(n);

const hasA = (r: { [k: string]: unknown }): r is { a: unknown } => 'a' in r;

const hasB = (r: { [k: string]: unknown }): r is { b: unknown } => 'b' in r;

const hasAandB = pipe(hasA, refinementAnd(hasB));
const hasAorB = pipe(hasA, refinementOr(hasB));

const foo = (x) => hasAandB(x) && x.c;
