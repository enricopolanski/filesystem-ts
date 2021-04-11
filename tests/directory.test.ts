import { isDirectory, listDirectory, createTemporaryDirectory, removeDirectory, removeDirectoryRecursive, createDirectory } from "../src/directory";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
// import { promises } from "fs";

describe("directory", () => {

  it("should create a temporary folder", async () => {
    
    const temporaryDirectory = await createTemporaryDirectory("test-")();

    expect(E.isRight(temporaryDirectory)).toBeTruthy();

    // get the absolutePath of the randomly created temporary folder 
    const absolutePath = (temporaryDirectory as any).right.absolutePath;
      
    let directoryExists = await isDirectory(absolutePath)(); 

    expect(directoryExists).toBe(true);
      
    // remove the directory
    await removeDirectory(absolutePath)();

    directoryExists = await isDirectory(absolutePath)();

    expect(directoryExists).toBe(false);
  });
  
  it.skip("should return the contents of /fixtures", async () => {
    const result = await listDirectory("./tests/fixtures")();
    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      // expect(result.right).toStrictEqual(fixtures);
    }
  });

  it.skip("should return a No Entity Error for an invalid directory", async () => {
    const result = await listDirectory("")();
    expect(E.isRight(result)).toBe(false);
    if (!E.isRight(result)) {
      expect(result.left).toStrictEqual({
        type: "ENOENT",
        message: "No Entity Found at path: ",
        path: "",
        syscall: "scandir",
      });
    }
  });
});

/*
const withSetup: <A,B>(test: (s: string) => TE.TaskEither<A, B>) => TE.TaskEither<{result: TE.TaskEither<unknown, B> }> 
  = test => pipe(
    TE.Do,
    TE.apS('temporaryDirectory', createTemporaryDirectory("test-")),
    TE.bind('result', ({ temporaryDirectory }) => test(temporaryDirectory.absolutePath)),
    TE.chainFirst(result => removeDirectory(result.temporaryDirectory.absolutePath)),
  )
*/

describe('createDirectory', ()=> {
  it('should create a directory', async ()=> {
    const test = await pipe(
      TE.Do,
      TE.apS('temporaryDirectory', createTemporaryDirectory("test-")),
      TE.bind('fixtures', ({ temporaryDirectory }) => createDirectory(temporaryDirectory.absolutePath + '/fixtures')),
      TE.chainFirst(result => removeDirectoryRecursive(result.temporaryDirectory.absolutePath)),
    )();

    const desiredResult = E.right({
        fixtures: {
          absolutePath: expect.stringContaining("fixtures"),
	  name: "fixtures",
	  path: expect.stringContaining("fixtures"),
	  type: "Directory",
	}
      })
    expect(test).toMatchObject(desiredResult);
  });
})
