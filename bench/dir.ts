import { promises } from 'fs';
import { resolve, normalize } from 'path';

// promises.readdir('.'); //?
normalize('.'); // .
resolve('.'); // /home/enrico/dev/bench/filesystem-ts
