import { listDirectory, createTemporaryDirectory } from "../src/directory";
import * as E from "fp-ts/Either";
import { stat, rmdir } from "fs/promises";

describe("directory", () => {
  it("should create a temporary folder", async (done) => {
    const temporaryDirectory = await createTemporaryDirectory("test-")();
    if (E.isRight(temporaryDirectory)) {
      const directoryStats = await stat(temporaryDirectory.right.absolutePath);
      expect(directoryStats.isDirectory()).toBeTruthy();

      await rmdir(temporaryDirectory.right.absolutePath);
      console.log("here");
      const ld = await listDirectory(temporaryDirectory.right.absolutePath)();
      console.log('LOLOL');
      if (E.isLeft(ld)) {
        console.log('LALAL')
        expect(ld.left.type).toBe("ENOENTS");
        done()
      } else {
        expect(ld.right).toBe("ENOENT");
        done.fail(String(ld));
      }
    } else {
      done.fail(temporaryDirectory.left);
    }
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
