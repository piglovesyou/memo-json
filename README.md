# memo

A memoization decorator caching JSON results to disk. Speed up development applications depending on external resources.

## Usage

```typescript
// src/data.ts
import { memo } from 'memo'

@memo
function getRemoteData(param: string) { ... }

await getRemoteData('a') // Access remote
await getRemoteData('a') // 🥶 Hit cache!
await getRemoteData('b') // Access remote again. A cache key includes function arguments.
```

The first run of the above code will generate cache like below being reused in the subsequent calls.

```
.memo/src/data/getRemoteData-4e6c99.json
.memo/src/data/getRemoteData-dee827.json
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
