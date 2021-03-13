import { promises, Dirent } from 'fs';
import * as TE from 'fp-ts/TaskEither';
import { identity } from 'fp-ts/lib/function';
import { NoEntity, UnknownError } from '../errors';
import { Entity } from '../entities';

const _readDir = (s: string) => promises.readdir(s, { withFileTypes: true });

const readDir = TE.tryCatchK(_readDir, identity);

declare const listDirectory: (
  s: string
) => TE.TaskEither<NoEntity | UnknownError, Entity[]>;
