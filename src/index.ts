import { existsSync, readFileSync, writeFileSync } from "fs";
import { rm } from "fs/promises";
import makeDir, { sync as makeDirSync } from "make-dir";
import { join, relative } from "path";
import { createHash } from "./hash";
import { debug } from "./logger";

export type CreateMemoOptions = {
  dir?: string;
  enable?: boolean;
};

const cwd = process.cwd();

const defaultDir = ".memo";

export function createMemo({
  dir = defaultDir,
  enable = true,
}: CreateMemoOptions = {}): <T extends Function>(fn: T) => T {
  const cacheDir = join(cwd, dir);
  makeDirSync(cacheDir);

  return function memo<T extends Function>(fn: T): T {
    if (!enable) return fn;
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
  };
}

export async function clearCache({ dir = defaultDir, enable = true } = {}) {
  const cacheDir = join(cwd, dir);
  await rm(cacheDir, { recursive: true, force: true });
  await makeDir(cacheDir);
}

export const memo = createMemo();