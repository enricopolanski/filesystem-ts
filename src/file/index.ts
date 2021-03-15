import { Dirent } from 'fs';
import { Newtype, prism } from 'newtype-ts';
import * as D from 'io-ts/Decoder';

export interface File {
  type: 'File';
  name: string;
  path: string;
  absolutePath: string;
}

export const FileDecoder: D.Decoder<unknown, File> = D.struct({
  type: D.literal('File'),
  name: D.string,
  path: D.string,
  absolutePath: D.string,
});

interface DirentFile
  extends Newtype<{ readonly DirentFile: unique symbol }, Dirent> {}

export const isFile = (dirent: Dirent) => dirent.isFile();
export const prismFile = prism<DirentFile>(isFile);

export const fileFromDirent: (pathInfo: {
  path: string;
  absolutePath: string;
}) => (dirent: Dirent) => File = (pathInfo) => (dirent) => ({
  type: 'File',
  name: dirent.name,
  path: pathInfo.path,
  absolutePath: pathInfo.absolutePath,
});
