import { isDirectory, listDirectory, createTemporaryDirectory, removeDirectory, createDirectory } from "../src/directory";
import * as E from "fp-ts/Either";
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
  
  it("should create a directory inside the os' temporary folder", async () => {
    const temporaryDirectory = await createTemporaryDirectory("test-")();
    const absolutePath: string = (temporaryDirectory as any).right.absolutePath;

    // create a "fixtures" directory inside temporaryDirectory
    const fixturesPath = absolutePath + "/fixtures";
    const fixtures = await createDirectory(fixturesPath)();

    // test the returned type 
    expect(fixtures).toStrictEqual(E.right({ type: "Directory", path: fixturesPath, absolutePath: fixturesPath , name: 'fixtures', }));

    // test the folder exists
    const fixturesExists = await isDirectory(fixturesPath)();
    expect(fixturesExists).toBe(true)

    // remove the "fixtures" directory inside temporaryDirectory
    await removeDirectory(fixturesPath)();
    const fixturesExistsAfterDelete = await isDirectory(fixturesPath)();
    expect(fixturesExistsAfterDelete).toBe(false);

    // delete the temporaryDirectory for cleanup
    await removeDirectory(absolutePath)();
    const directoryExists = await isDirectory(absolutePath)();
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
