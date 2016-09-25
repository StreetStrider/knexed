# knexed

[![Travis](https://img.shields.io/travis/StreetStrider/knexed.svg?style=flat-square)](https://travis-ci.org/StreetStrider/knexed)
[![Coveralls](https://img.shields.io/coveralls/StreetStrider/knexed.svg?style=flat-square)](https://coveralls.io/github/StreetStrider/knexed)
[![npm|knexed](http://img.shields.io/badge/npm-knexed-CB3837.svg?style=flat-square)](https://www.npmjs.org/package/knexed)
[![flowtype](http://img.shields.io/badge/flow-type-EBBF3A.svg?style=flat-square)](#flow)
[![MIT licensed](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](license.txt)

Adds some neatness to [Knex](http://knexjs.org/) library. Utilities for tables, joins, transactions and other.

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

### table helpers (`table/table`)
```js
/* create init point for this table queries: */
var accounts = table(knex, 'accounts')

/* `accounts()` creates new query at every invocation */
accounts().select()
accounts(trx).select() /* as a part of transaction `trx` */
accounts.as('alias').select() /* with alias */
accounts.as('alias', trx).select()
/* … then build query … */
```

### transaction helpers (`tx/method`)
```js
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

### join helpers (`table/join`)
Use `join` helper for symmetric-looking joins. `table` is used as basis.
```js
/* prepare two tables: */
var accounts = table(knex, 'accounts')
var messages = table(knex, 'messages')

/* join by accounts.id = messages.user_id: */
var accounts$messages = join(accounts, messages, [ 'id', 'user_id' ])
/* `accounts$messages()` creates new query at every invocation */

/* then use as simple table */
accounts$messages()
.select('user_id', 'text')
.where('user_id', user_id)

/* as a part of transaction `trx` */
accounts$messages(trx).select()

/* supported join types: */
join.left(accounts, messages, [ 'id', 'user_id' ])
join.right(messages, accounts, [ 'id', 'user_id' ])
join.full(table_a, table_b, [ 'id', 'user_id' ])
join.cross(table_a, table_b)

/* pick predicate: */
join(accounts, messages, [ 'id', '=', 'user_id' ])
join.left(accounts, messages, [ 'id', '<>', 'user_id' ])

/* join by accounts.id = messages.id, like NATURAL JOIN: */
join(accounts, messages, 'id')

/* join with aliases */
/* accounts as A, messages as M,
   this will also pick proper aliases on join predicate
 */
join([ accounts, 'A' ], [ messages, 'M' ], [ 'id', 'user_id' ])
```

## flow
We're providing built-in [Flow](https://flowtype.org/) type definitions.

## license
MIT.
© Strider, 2016.
