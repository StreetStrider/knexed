# knexed

[![Travis](https://img.shields.io/travis/StreetStrider/knexed.svg?style=flat-square)](https://travis-ci.org/StreetStrider/knexed)
[![Coveralls](https://img.shields.io/coveralls/StreetStrider/knexed.svg?style=flat-square)](https://coveralls.io/github/StreetStrider/knexed)
[![npm|knexed](http://img.shields.io/badge/npm-knexed-CB3837.svg?style=flat-square)](https://www.npmjs.org/package/knexed)
[![flowtype](http://img.shields.io/badge/flow-type-EBBF3A.svg?style=flat-square)](#flow)
[![MIT licensed](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](license.txt)

Utilities for [Knex](http://knexjs.org/) library.

## API
### dataset helpers
```js
knex('table').select()
/* build query … */

/* then use one of utilities: */
.then(one)        // pick exact 1 row
.then(one.maybe)  // pick 0..1 rows
.then(exists)     // true/false depending on rows existence
.then(exists.not) // negated true/false on existence
.then(count)      // pick rows count
.then(project('id')) // compose object with rows by ids
```

### table helpers
```js
/* create init point for this table queries: */
var accounts = table(knex, 'accounts')

/* then use it */
accounts().select()
accounts(trx).select() /* as a part of transaction `trx` */
accounts.as('alias').select()
accounts.as('alias', trx).select()
/* then build query … */

/* create method */
var create = method(knex, (trx, name) =>
{
	return accounts(trx).insert({ name: name })
})

/* then use it */
create(trx, 'Name') /* as a part of transaction `trx` */
create('Name') /* new transaction will be started */
create(method.NOTX, 'Name') /* if you don't need transaction at all */
```

## flow
We're providing built-in [Flow](https://flowtype.org/) type definitions.

## license
MIT.
© Strider, 2016.
