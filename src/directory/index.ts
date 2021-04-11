import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import { promises, Dirent, Stats } from "fs";
import { flow, identity, pipe } from "fp-ts/lib/function";
import {
  NoEntity,
  NoEntityDecoder,
  NotADirectory,
  NotADirectoryDecoder,
  NotEmptyDirectory,
  NotEmptyDirectoryDecoder,
  orUnknownError,
  unknownError,
  UnknownError,
} from "../errors";
import { Entity } from "../entities";
import { fileFromDirent, isFile } from "../file";
import { isSymLink, symLinkFromDirent } from "../symlink";
import { resolve } from "path";
import * as D from "io-ts/Decoder";
import { basename, sep } from "path";
import { tmpdir } from "os";

/**
 * Data type representing a `Directory` entity in the filesystem.
 */ 
export interface Directory {
  type: "Directory";
  name: string;
  path: string;
  absolutePath: string;
}

/**
 * Decodes given input, returning Either a Directory or a decode error.
 */
export const DirectoryDecoder: D.Decoder<unknown, Directory> = D.struct({
  type: D.literal("Directory"),
  name: D.string,
  path: D.string,
  absolutePath: D.string,
});

const _isDirectory = (dirent: Dirent): boolean => dirent.isDirectory();

/**
 * Type constructor for a `Directory` type.
 */
export const directoryOf: (pathInfo: {
  path: string;
  absolutePath: string;
}) => (name: string) => Directory = (pathInfo) => (name) => ({
  type: "Directory",
  name: name,
  path: pathInfo.path,
  absolutePath: pathInfo.absolutePath,
});

const fsPromiseToTE: <A, B>(
  f: (a: A) => Promise<B>
) => (a: A) => TE.TaskEither<unknown, B> = (f) => TE.tryCatchK(f, identity);

const getName: (dirent: Dirent) => string = (dirent) => dirent.name;

const _readDir: (path: string) => Promise<Dirent[]> = (s: string) =>
  promises.readdir(s, { withFileTypes: true });

const readDir: (path: string) => TE.TaskEither<unknown, Dirent[]> = fsPromiseToTE(
  _readDir
);

const _mkdtemp = (prefix: string) => promises.mkdtemp(tmpdir() + sep + prefix);

const mkdtemp = fsPromiseToTE(_mkdtemp);

const decodeListDirectoryError = pipe(
  D.union(NoEntityDecoder, NotADirectoryDecoder),
  orUnknownError
);

const getMetadataError: (
  u: unknown
) => MetadataError = decodeListDirectoryError;

type ListDirectoryError = NoEntity | NotADirectory | UnknownError;
type MetadataError = ListDirectoryError;

/**
 * Returns a list of all `Entity`s in `pathname`
 */
export const listDirectory = (
  path: string
): TE.TaskEither<ListDirectoryError, Entity[]> =>
  pipe(
    TE.Do,
    TE.bind("absolutePath", () => TE.right(resolve(path))),
    TE.bind("path", () => TE.right(path)),
    TE.chain((info) =>
      pipe(
        readDir(path),
        TE.mapLeft(decodeListDirectoryError),
        TE.map((dirents) => ({
          directories: pipe(
            dirents,
            A.filter(_isDirectory),
            A.map(flow(getName, directoryOf(info)))
          ),
          files: pipe(dirents, A.filter(isFile), A.map(fileFromDirent(info))),
          symLinks: pipe(
            dirents,
            A.filter(isSymLink),
            A.map(symLinkFromDirent(info))
          ),
        })),
        TE.map((directory) => [
          ...directory.directories,
          ...directory.files,
          ...directory.symLinks,
        ])
      )
    )
  );

/**
 * Creates a temporary directory inside the OS' default temporary directory.
 * The `prefix` will determine the first part of the directory name,
 * the rest being randomly generated by the OS.
 */
export const createTemporaryDirectory: (
  prefix: string
) => TE.TaskEither<UnknownError, Directory> = (prefix) =>
  pipe(
    mkdtemp(prefix),
    TE.map((path) =>
      directoryOf({ path: path, absolutePath: path })(basename(path))
    ),
    TE.mapLeft(unknownError)
  );

const _stat = (path: string) => promises.stat(path, { bigint: false });

const stat: (path: string) => TE.TaskEither<unknown, Stats> = fsPromiseToTE(_stat);

/**
 * Retrieves information about the file pointed to by `pathname`
 */
export const getMetadata: (
  path: string
) => TE.TaskEither<MetadataError, Stats> = flow(
  stat,
  TE.mapLeft(getMetadataError)
);

const getDirectory = (path: string) =>
  pipe(
    getMetadata(path),
    TE.chain((stat) =>
      stat.isDirectory()
        ? TE.right(stat)
        : TE.left({
            type: "ENOTDIR" as "ENOTDIR",
            path: path,
            syscall: "UNKNOWN",
            message: path + " is NOT a Directory",
          })
    )
  );

/**
 * Checks if given `pathname` is a directory.
 */
export const isDirectory: (path: string) => T.Task<boolean> = flow(getDirectory, T.map(E.isRight));

const _mkdir = (path: string) => promises.mkdir(path);

const mkdir = fsPromiseToTE(_mkdir);

type CreateDirectoryError = UnknownError;

/**
 * Creates a new empty directory at the provided `pathname`.
 */
export const createDirectory: (path: string) => TE.TaskEither<CreateDirectoryError, Directory> = path => pipe(mkdir(path), TE.mapLeft(unknownError), TE.map(() => ({
  type: "Directory",
  path: path,
  name: basename(path),
  absolutePath: path 
})));

const _rmdir = (path: string) => promises.rmdir(path);
const rmdir = fsPromiseToTE(_rmdir);

const _rmdirRecursive = (path: string) => promises.rmdir(path, {recursive: true});
const rmdirReducursive = fsPromiseToTE(_rmdirRecursive);

type RemoveDirectoryError = NotEmptyDirectory | UnknownError;

const removeDirectoryError = pipe(NotEmptyDirectoryDecoder, orUnknownError);

/**
 * Removes an existing directory `pathname`. The operation may, and will likely fail if removal constraints are unmet (e.g. the directory not being empty will likely not be removable).
 */
export const removeDirectory: (path: string) => TE.TaskEither<RemoveDirectoryError, void> = flow(rmdir, TE.mapLeft(removeDirectoryError));

/**
 * Removes an existing directory `dir` together with its contents and subdirectories. Similar to `rm -rf`.
 */
export const removeDirectoryRecursive : (path: string) => TE.TaskEither<RemoveDirectoryError, void> = flow(rmdirReducursive, TE.mapLeft(removeDirectoryError));

