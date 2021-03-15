import { listDirectory } from '../src/directory/index';
import { readdir } from 'fs/promises';

listDirectory('/dev/null')(); //?
// readdir('/dev/null').then(Object.keys, Object.entries); //?
