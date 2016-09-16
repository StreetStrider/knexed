# knexed

[![Travis](https://img.shields.io/travis/StreetStrider/knexed.svg?style=flat-square)](https://travis-ci.org/StreetStrider/knexed)
[![Coveralls](https://img.shields.io/coveralls/StreetStrider/knexed.svg?style=flat-square)](https://coveralls.io/github/StreetStrider/knexed)
[![npm|knexed](http://img.shields.io/badge/npm-knexed-CB3837.svg?style=flat-square)](https://www.npmjs.org/package/knexed)
[![flowtype](http://img.shields.io/badge/flow-type-EBBF3A.svg?style=flat-square)](#flow)
[![MIT licensed](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](license.txt)

Utilities for [knex](http://knexjs.org/) library.

## API
Here's examples:

```js
knex('table').select()
/* build query … */

/* use one of utilities: */
.then(one)        // pick exact 1 row
.then(one.maybe)  // pick 0..1 rows
.then(exists)     // true/false depending on rows existence
.then(exists.not) // negated true/false on existence
.then(count)      // pick rows count
```

## flow
We're providing built-in [Flow](https://flowtype.org/) type definitions.

## license
MIT.
© Strider, 2016.
