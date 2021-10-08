# memo-json [![Node CI](https://github.com/piglovesyou/memo-json/actions/workflows/nodejs.yml/badge.svg)](https://github.com/piglovesyou/memo-json/actions/workflows/nodejs.yml) ![npm](https://badge.fury.io/js/memo-json.svg)

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
# ${process.cwd()}/${functionName}-${paramHash}.json
.memo/getData-4e6c99.json
.memo/getData-dee827.json
```

## Options

You can own your cusomized `memo()` funciton by `createMemo(opts)`.

Available options:

- `dir` - Optional string. `".memo"` by default.
- `enable` - Optional boolean. `true` by default.

Cusomization example:

```typescript
import { createMemo } from "memo-json";

const memo = createMemo({
  dir: "__generated",
  enable: process.env.NODE_ENV !== "production",
});

const getDataMemo = memo(function getData() { ... })
```

## Debug

Debug logs are available when you pass a `DEBUG` environment variable.

```bash
DEBUG=memo-json ts-node your-script.ts

# memo-json Cached .memo/xxx-5c9359.json +0ms
```

## License

Apache 2.0

## Author

Soichi Takamura @piglovesyou
