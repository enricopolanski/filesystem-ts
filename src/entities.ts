import { Directory, DirectoryDecoder } from './directory';
import { File, FileDecoder } from './file';
import { SymLink, SymLinkDecoder } from './symlink';
import * as D from 'io-ts/Decoder';
/**
 * Type representing the union of all the interfaces representing entities in the File System.
 */
export type Entity = File | Directory | SymLink;

export const EntityDecoder: D.Decoder<unknown, Entity> = D.union(
  FileDecoder,
  DirectoryDecoder,
  SymLinkDecoder
);
