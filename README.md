# FileSystem-ts

Experimental, work-in-progress, filesystem library.

Inspired by:

[System.Directory](https://hackage.haskell.org/package/directory-1.3.6.1/docs/System-Directory.html)

[std::fs](https://doc.rust-lang.org/std/fs/index.html)

## API

### Directory

- `listDirectory` 

```ts
(s: string) => TaskEither<ListDirectoryError, Entity[]>
```

Returns a list of all entries in dir without the special entries (. and ..)