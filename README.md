# memo-json

A memoization decorator caching JSON results to disk. Speed up development applications depending on external resources.

## Install package

```bash
yarn add memo-json
```

## Usage

```typescript
// src/data.ts
import {memo} from 'memo'

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

## Debug

Debug logs are available when you have `DEBUG` environment.

```bash
DEBUG=memo-json ts-node your-script.ts

# memo-json Cached .memo/xxx-5c9359.json +0ms
```

## Options

* `dir` - Optional, `".memo"` by default. ex. `@memo({ dir: '__generated__' })`
* `enable` - Optional, `true` by default. ex. `@memo({ enable: process.env.NODE_ENV !== 'production' })`

## CLI

```bash
memo clean  # Equivalent to `rm -rf .memo`
```

## License

Apache 2.0

## Author

Soichi Takamura @piglovesyou
