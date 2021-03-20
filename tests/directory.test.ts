import { isDirectory, listDirectory, createTemporaryDirectory, removeDirectory } from "../src/directory";
import * as E from "fp-ts/Either";
import { promises } from "fs";

describe("directory", () => {
  it("should be able to tell wheter ./fixtures exist", async ()=> {
    // should give the same results modeled on fs.stats
  });

  it.skip("should remove a freshly created folder", async ()=> {
    const fixtures = __dirname + "/fixtures";
    await promises.mkdir(fixtures);
    let directoryExists = await  isDirectory(fixtures);
    expect(directoryExists).toBe(true);
  });
  
  it("should create a temporary folder", async () => {
    
    const temporaryDirectory = await createTemporaryDirectory("test-")();

    expect(E.isRight(temporaryDirectory)).toBeTruthy();

    // get the absolutePath of the randomly created temporary folder 
    const absolutePath = (temporaryDirectory as any).right.absolutePath;
      
    let directoryExists = await isDirectory(absolutePath)(); 

    expect(directoryExists).toBeTruthy();
      
    // remove the directory
    await removeDirectory(absolutePath)();

    directoryExists = await isDirectory(absolutePath)();

    expect(directoryExists).toBeFalsy();
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
