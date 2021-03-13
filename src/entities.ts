import { Directory } from './directory/directory';
import { File } from './files/file';

/**
 * Type representing the union of all the interfaces representing entities in the File System.
 */
export type Entity = File | Directory;
