import { access, stat } from 'fs/promises';
import { constants, existsSync } from 'fs';
import { promisify } from 'util';

const exists = promisify(existsSync);

exists('./').then(console.log); //?
