import { promises, Stats } from 'fs';
import * as TE from 'fp-ts/TaskEither';
import { flow, identity } from 'fp-ts/function';
import { getMetadataError } from '../src/directory/index';

const fsPromiseToTE: <A, B>(
  f: (a: A) => Promise<B>
) => (a: A) => TE.TaskEither<unknown, B> = (f) => TE.tryCatchK(f, identity);

// stat('.'); //?
const _stat = (s: string) => promises.stat(s, { bigint: false });

const stat: (a: string) => TE.TaskEither<unknown, Stats> = fsPromiseToTE(_stat);

const getMetadata = flow(stat, TE.mapLeft(getMetadataError));

getMetadata('.')(); //?
