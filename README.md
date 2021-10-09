# memo-json [![Node CI](https://github.com/piglovesyou/memo-json/actions/workflows/nodejs.yml/badge.svg)](https://github.com/piglovesyou/memo-json/actions/workflows/nodejs.yml)

Memoize functions returning JSON by caching results to disk. Useful for applications depending on external resources.

To install:

```bash
npm install memo-json
# or
yarn add memo-json
```

## Usage

```typescript
// src/data.ts
import { memo } from 'memo-json'

const getDataMemo = memo(function getData(param: string) { ... })

await getDataMemo('a') // Access remote
await getDataMemo('a') // 🥶 Hit cache!
await getDataMemo('b') // Access remote again. A cache key includes function arguments.
```

The first run of the above code will generate cache like below being reused in the subsequent calls.

```
# ${process.env.cwd()}/${functionName}-${paramHash}.json
.memo/getRemoteData-4e6c99.json
.memo/getRemoteData-dee827.json
```

## Options

You can own your cusomized `memo()` funciton by `createMemo(opts)`.

```typescript
import { createMemo } from "memo-json";

const memo = createMemo({
  dir: "__generated",
  enable: process.env.NODE_ENV !== "production",
});

const getDataMemo = memo(function getData() { ... })
```

## Debug

Debug logs are available when you have `DEBUG` environment.

```bash
DEBUG=memo-json ts-node your-script.ts

# memo-json Cached .memo/xxx-5c9359.json +0ms
```

Available options:

- `dir` - Optional string. `".memo"` by default.
- `enable` - Optional boolean. `true` by default.

## License

Apache 2.0

## Author

Soichi Takamura @piglovesyou
