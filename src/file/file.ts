import { Dirent } from 'fs';
import { Newtype, prism } from 'newtype-ts';

export interface File {
  type: 'File';
  name: string;
  absolutePath: string;
}

interface DirentFile
  extends Newtype<{ readonly DirentFile: unique symbol }, Dirent> {}

const isFile = (dirent: Dirent) => dirent.isFile();
const prismFile = prism<DirentFile>(isFile);

export interface File {
  type: 'File';
  name: string;
  absolutePath: string;
}

export const fromDirent: (s: string) => (dirent: DirentFile) => File = (s) => (
  dirent
) => ({
  type: 'File',
  name: prismFile.reverseGet(dirent).name,
  absolutePath: s,
});
