import { existsSync, readFileSync, writeFileSync } from "fs";
import { rm } from "fs/promises";
import makeDir, { sync as makeDirSync } from "make-dir";
import { join, relative } from "path";
import { createHash } from "./hash";
import { debug } from "./logger";

const cwd = process.cwd();
const cacheDir = join(cwd, ".memo");
makeDirSync(cacheDir);

function memo<T extends Function>(fn: T): T {
  const fnName = fn.name || "_";
  const wrapped: any = async function (...args: any[]) {
    const serializedArg = JSON.stringify(args);
    const argsHash = createHash(serializedArg);
    const cacheFullPath = join(cacheDir, `${fnName}-${argsHash}.json`);
    if (existsSync(cacheFullPath)) {
      debug("Hit the cache %s", relative(cwd, cacheFullPath));
      const content = readFileSync(cacheFullPath, "utf-8");
      return JSON.parse(content);
    }
    const result = await fn(...args);

    const serialized = JSON.stringify(result);
    writeFileSync(cacheFullPath, serialized!);
    debug("Cached %s", relative(cwd, cacheFullPath));
    return result;
  };
  return wrapped;
}

async function clearCache() {
  await rm(cacheDir, { recursive: true, force: true });
  await makeDir(cacheDir);
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("index.test.ts", () => {
  test(
    "main",
    async () => {
      await clearCache();

      const getData = jest.fn(async (args: any) => {
        await timeout(100);
        return args;
      });
      const getDataMemoized = memo(getData);

      await getDataMemoized({ a: "a" }); // Cache
      await getDataMemoized({ a: "a" }); // Hit cache
      await getDataMemoized({ b: "b" }); // Cache

      expect(getData.mock.calls.length).toBe(2);
    },
    100 * 1000
  );
});
