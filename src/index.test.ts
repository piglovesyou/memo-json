import { clearCache, memo } from "./index";

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("index.test.ts", () => {
  beforeEach(async () => {
    await clearCache();
  });
  test(
    "main",
    async () => {
      const getData = jest.fn(async (args: any) => {
        await timeout(100);
        return args;
      });
      const getDataMemo = memo(getData);

      await getDataMemo({ a: "a" }); // Cache
      await getDataMemo({ a: "a" }); // Hit cache
      await getDataMemo({ b: "b" }); // Cache

      expect(getData.mock.calls.length).toBe(2);
    },
    100 * 1000
  );
});
