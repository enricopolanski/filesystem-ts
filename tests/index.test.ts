import { listDirectory } from '../src/directory/';
import * as D from 'io-ts/Decoder';
import { Entity, EntityDecoder } from '../src/entities';
import * as E from 'fp-ts/Either';

const fixtures = [
  {
    type: 'Directory',
    name: 'nested',
    path: './tests/fixtures',
    absolutePath: '/home/enrico/dev/bench/filesystem-ts/tests/fixtures',
  },
  {
    type: 'File',
    name: 'a.md',
    path: './tests/fixtures',
    absolutePath: '/home/enrico/dev/bench/filesystem-ts/tests/fixtures',
  },
  {
    type: 'File',
    name: 'b.md',
    path: './tests/fixtures',
    absolutePath: '/home/enrico/dev/bench/filesystem-ts/tests/fixtures',
  },
  {
    type: 'SymLink',
    name: 'WALLABYSYMLINK',
    path: './tests/fixtures',
    absolutePath: '/home/enrico/dev/bench/filesystem-ts/tests/fixtures',
  },
];

describe('should reflect the correct API behavior', () => {
  it('should return the contents of /fixtures', async () => {
    const result = await listDirectory('./tests/fixtures')();
    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toStrictEqual(fixtures);
    }
  });

  it('should return a No Entity Error for an invalid directory', async () => {
    const result = await listDirectory('')();
    expect(E.isRight(result)).toBe(false);
    if (!E.isRight(result)) {
      expect(result.left).toStrictEqual({
        type: 'ENOENT',
        message: 'No Entity Found at path: ',
        path: '',
        syscall: 'scandir',
      });
    }
  });
});
