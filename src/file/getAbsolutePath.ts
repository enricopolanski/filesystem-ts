import { flow, identity, pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import * as IOE from 'fp-ts/IOEither';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';

// export const getAbsolutePath = IOE.tryCatch(() => {
//   throw error;
// }, identity);

const findFirstGetAbsolutePath: (trace: string[]) => O.Option<string> = flow(
  A.findFirst((s) => s.includes('file/getAbsolutePath'))
);

export const getAbsolutePath = () => {
  try {
    throw new Error();
  } catch (error) {
    return new Error().stack!.split(/\n/g);
  }
};

pipe(getAbsolutePath(), findFirstGetAbsolutePath); //?
