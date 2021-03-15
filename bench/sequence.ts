import * as A from 'fp-ts/Array';
import * as T from 'fp-ts/Task';

const result = A.sequence(T.ApplicativeSeq)([T.of(1), T.of(3)]); //? T.Task<number[]>
