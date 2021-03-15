import { Dirent } from 'fs';
import { Newtype, prism } from 'newtype-ts';
import * as D from 'io-ts/Decoder';

export interface SymLink {
  absolutePath: string;
  name: string;
  path: string;
  type: 'SymLink';
}

export const SymLinkDecoder: D.Decoder<unknown, SymLink> = D.struct({
  type: D.literal('SymLink'),
  name: D.string,
  path: D.string,
  absolutePath: D.string,
});

interface DirentSymLink
  extends Newtype<{ readonly DirentSymLink: unique symbol }, Dirent> {}

export const isSymLink = (dirent: Dirent) => dirent.isSymbolicLink();
export const prismSymLink = prism<DirentSymLink>(isSymLink);

export const symLinkFromDirent: (pathInfo: {
  absolutePath: string;
  path: string;
}) => (dirent: Dirent) => SymLink = (pathInfo) => (dirent) => ({
  type: 'SymLink',
  name: dirent.name,
  path: pathInfo.path,
  absolutePath: pathInfo.absolutePath,
});
