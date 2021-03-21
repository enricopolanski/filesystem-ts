import { isDirectory } from "../src/directory";

/** 
  Primitives: functions required for other tests.
*/

describe("primitives", ()=> {
  it("should be able to tell whether ./fixtures exist", async ()=> {
    const fixtures = __dirname + "/fixtures";
    const directoryExists = await isDirectory(fixtures)();
    expect(directoryExists).toBe(true);
  })
});
