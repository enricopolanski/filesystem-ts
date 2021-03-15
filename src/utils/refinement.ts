import { Refinement } from 'fp-ts/lib/function';

export const or = <A, B extends A>(rab: Refinement<A, B>) => <C extends A>(
  rac: Refinement<A, C>
) => (a: A): a is B | C => rab(a) || rac(a);

export const and = <A, B extends A>(rab: Refinement<A, B>) => <C extends A>(
  rac: Refinement<A, C>
) => (a: A): a is B & C => rab(a) && rac(a);
