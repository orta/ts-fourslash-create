# ts-fourslash-create CLI

A CLI for creating a fourslash test file for the TypeScript compiler based on a repro folder.

### Usage

```sh
$ npx ts-fourslash-create [optional path]

/// <reference path="fourslash.ts" />

// @target: es5
// @module: commonjs
// @allowJs: true
// @checkJs: true
// @esModuleInterop: true

// @Filename: ex.js
////import foo from './other'
////// const a =
////foo.defaults = 23
////
////
////// const a = require("axios")
////// a.default.defaults.timeout = 22
////

// @Filename: other.js
////export default {
////  defaults: "hello"
////}
////

// @Filename: src/thing.ts
////enum Rating {
////  Like = 1,
////  Dislike
////};
////
////let a: Rating;
////
////switch (a) {
////  case Rating.Like:
////    break;
////
////  case Rating.Dislike:
////    break;
////
////  default:
////    let s: never = a;
////}
```

### Direct to pasteboard (on os x)

```sh
npx ts-fourslash-create repros/23211 | pbcopy
```

### Direct to a file

```sh
npx ts-fourslash-create > testFile.ts
```

# License

MIT - see LICENSE

