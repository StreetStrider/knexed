# knexed

[![Travis](https://img.shields.io/travis/StreetStrider/knexed.svg?style=flat-square)](https://travis-ci.org/StreetStrider/knexed)
[![Coveralls](https://img.shields.io/coveralls/StreetStrider/knexed.svg?style=flat-square)](https://coveralls.io/github/StreetStrider/knexed)
[![npm|knexed](http://img.shields.io/badge/npm-knexed-CB3837.svg?style=flat-square)](https://www.npmjs.org/package/knexed)
[![flowtype](http://img.shields.io/badge/flow-type-EBBF3A.svg?style=flat-square)](#flow)
[![MIT licensed](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](license.txt)

Adds some neatness to [Knex](http://knexjs.org/) library. Utilities for tables, joins, transactions and other.

### why?
There're three ways to work with relational DB on an application side: raw SQL, query builders, ORMs.

I prefer query builders over other two and find it a perfect balance.

* **why not raw SQL**: I love SQL and plain queries, but it lacks two main features from application's view: *composability* and *type control*. By *composability* I mean that I can create query with multiple variative clauses and not bother with string glueing, putting spaces and commas here and there. By *type control* I mean bi-directional type conversions and data escaping. Both theese issues are perfectly solved by query builders.
* **why not ORM**: I dislike ORMs because they compel me for specific application structure, to use special type-wrappers and stateful data workflow. They often have ugly verbose API, poor performance, crazy output queries and bring no benefits comparing to query builders. On the other hand query builders work with native language types and encourage functional data-flow instead of «statefulness».

The lead query builder in JS ecosystem is **Knex**. I don't like it much for poor code style & architecture, not so good API. Yes, Knex is not perfect, however this is the leading project in this area and it tends to stay so. It working, it will receive updates, fixes and improves. I decided to build a better abstractions over it with composability and much more JS/Lispy-crazy-science-style in mind. The only restriction is not to fall into ORM-ish style. So this library contains only simple helpers and composable abstractions. Feel free to use another good solutions (like [Bluebird's Promise extensions](http://bluebirdjs.com/docs/api-reference.html) which is built-in for Knex, [Lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide), [Ramda & lenses](http://ramdajs.com/) etc) along the way.

## API
Import / require modules you need explicitly. Most of functionality is accessible from the root of the package, like `require('knexed/one')`, `require('knexed/exists')`. Some utilities are bundled into groups by usage, like `require('knexed/table/table')`, `require('knexed/table/join')`. The group of utility is mentioned in the braces below.

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
   return accounts(trx).insert({ name })
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

### query helpers (`query`)
This helpers transform generated query.
```js
var accounts = table(knex, 'accounts')

var q = accounts().where('id', '>', 1000)

/* `query/count` transforms query into COUNT() one */
var qc = count(q) // returning `number`

/* `query/exists` transforms query into EXISTS(SELECT …) */
var qe = exists(q) // returning `boolean`
```

Note that `count` & `exists` from dataset helpers works on returning
dataset, which means streaming potentially large amount of redundant data from
database driver to client. In contrast `query/count` & `query/exists`
works on driver's side, sending to client only simple scalars.

### catch constraints (`catch/constraint`)
Catch constraints and rethrow them as your model-specific constraint errors.
```js
var accounts = table(knex, 'accounts')

function AlreadyExists ()
{
	return new TypeError('account_already_exists')
}

accounts()
.insert({ id: 1, name: 'account' })
.catch(...catch_constraint({ constraint: 'accounts_pkey' }, AlreadyExists))
```

```js
var accounts = table(knex, 'accounts')

function AlreadyExists (data)
{
	return { error: 'account_already_exists', conflict: data }
}

var id = 1

accounts()
.insert({ id, name: 'account' })
.catch(...catch_constraint({ constraint: 'accounts_pkey' }, { id }, AlreadyExists))
```

### guarantee proper updates & deletes (`updated`)
Will throw is zero or more than one row had been updated.
```js
var accounts = table(knex, 'accounts')

/* preventing too many (or zero) rows deletion */
accounts()
.delete()
.then(updated)
```

```js
var accounts = table(knex, 'accounts')

/* guarantee one and only one row modification */
accounts()
.where('name', 'not found')
.update('name', 'Not Found')
.then(updated)
```

## flow
We're providing built-in [Flow](https://flowtype.org/) type definitions.

## license
MIT.
© Strider, 2016 — 2018.
