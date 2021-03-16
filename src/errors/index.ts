import { flow, pipe } from 'fp-ts/lib/function';
import * as D from 'io-ts/Decoder';
import * as E from 'fp-ts/Either';
/**
 * Basic Error interface used for File System operation.
 * All File System errors extend this interface.
 */
type FSErrorCode = 'ENOENT' | 'UNKNOWN' | 'ENOTDIR';

export interface FSError {
  type: FSErrorCode;
}

export interface NoEntity extends FSError {
  message: string;
  path: string;
  syscall: string;
  type: 'ENOENT';
}

export const NoEntityDecoder: D.Decoder<unknown, NoEntity> = pipe(
  D.struct({
    errno: D.literal(-2),
    code: D.literal('ENOENT'),
    syscall: D.string,
    path: D.string,
  }),
  D.map((enoent) => ({
    message: 'No Entity Found at path: ' + enoent.path,
    path: enoent.path,
    syscall: enoent.syscall,
    type: 'ENOENT',
  }))
);

/**
 * Represents a development-purpose error.
 */
export interface UnknownError extends FSError {
  type: 'UNKNOWN';
  message: string;
}

export const unknownError: (error: unknown) => UnknownError = flow(
  String,
  (s) => ({
    type: 'UNKNOWN',
    message: s,
  })
);

export const orUnknownError = <A>(decoder: D.Decoder<unknown, A>) =>
  flow(decoder.decode, E.mapLeft(unknownError), E.toUnion);

export interface NotADirectory extends FSError {
  type: 'ENOTDIR';
  path: string;
  syscall: string;
  message: string;
}

export const NotADirectoryDecoder: D.Decoder<unknown, NotADirectory> = pipe(
  D.struct({
    errno: D.literal(-20),
    code: D.literal('ENOTDIR'),
    syscall: D.string,
    path: D.string,
  }),
  D.map((enoent) => ({
    message: enoent.path + ' is NOT a Directory',
    path: enoent.path,
    syscall: enoent.syscall,
    type: 'ENOTDIR',
  }))
);

export const NotADirectoryInputDecoder: D.Decoder<
  unknown,
  NotADirectory
> = D.struct({
  message: D.string,
  path: D.string,
  syscall: D.string,
  type: D.literal('ENOTDIR'),
});
