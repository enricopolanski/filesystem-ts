import {
  decodeListDirectoryError,
  readDir,
  isDirectory,
  directoryFromDirent,
} from '../src/directory';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { resolve } from 'path';
import * as A from 'fp-ts/Array';
import { fileFromDirent, isFile } from '../src/file';
import { isSymLink, symLinkFromDirent } from '../src/symlink';
import { NoEntity, UnknownError } from '../src/errors';
import { Entity } from '../src/entities';

// export const listDirectory: (
//   path: string
// ) => TE.TaskEither<NoEntity | UnknownError, Entity[]> = (path) =>
//   pipe(
//     TE.Do,
//     TE.bind('absolutePath', () => TE.right(resolve(path))),
//     TE.bind('path', () => TE.right(path)),
//     TE.chain((info) =>
//       pipe(
//         readDir(info.path),
//         TE.mapLeft(decodeListDirectoryError),
//         TE.map((dirents) => [
//           ...pipe(
//             dirents,
//             A.filter(isDirectory),
//             A.map((dirent) => ({
//               type: 'Directory',
//               name: dirent.name,
//               ...info,
//             }))
//           ),
//           ...pipe(
//             dirents,
//             A.filter(isFile),
//             A.map((dirent) => ({
//               type: 'File',
//               name: dirent.name,
//               ...info,
//             }))
//           ),
//           ...pipe(
//             dirents,
//             A.filter(isSymLink),
//             A.map((dirent) => ({
//               type: 'SymLink',
//               name: dirent.name,
//               ...info,
//             }))
//           ),
//         ])
//       )
//     )
//   );
// export const listDirectory: (
//   path: string
// ) => TE.TaskEither<NoEntity | UnknownError, Entity[]> = (path: string) =>
// getDir('.'); //?
export const listDirectory = (
  path: string
): TE.TaskEither<NoEntity | UnknownError, Entity[]> =>
  pipe(
    TE.Do,
    TE.bind('absolutePath', () => TE.right(resolve(path))),
    TE.bind('path', () => TE.right(path)),
    TE.chain((info) =>
      pipe(
        readDir(path),
        TE.mapLeft(decodeListDirectoryError),
        TE.map((dirents) => ({
          directories: pipe(
            dirents,
            A.filter(isDirectory),
            A.map(directoryFromDirent(info))
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
