import { mkdtemp } from 'fs/promises';
import { join, sep } from 'path';
import { tmpdir } from 'os';

tmpdir(); //?

mkdtemp(join(tmpdir(), 'test')); //?
