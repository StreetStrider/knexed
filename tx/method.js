/* @flow */
/* ::

import type { Knex } from 'knex'

export type Knex$Transaction$Optional<T>
= Knex$Transaction<T>
| void
| null
| Symbol // NOTX

export type $Async<T>
= (...args: Array<any>) => Bluebird$Promise<T>

export type $Async$Tx<T>
= (tx: Knex$Transaction<T>, ...args: Array<any>) => $Promisable<T>

export type $Async$Tx$Strict<T>
= (tx: Knex$Transaction<T>, ...args: Array<any>) => Bluebird$Promise<T>

*/

var slice = [].slice

var is = require('./is-tx')

var bmethod = require('bluebird').method
var curry   = require('curry')

var method = module.exports = curry(method_plain)

function method_plain /* ::<T> */
(
	kx /* :Knex */,
	fn /* :$Async$Tx<T> */
)
	/* :$Async<T> */
{
	var fn$ /* :$Async$Tx$Strict<T> */ = bmethod(fn)

	return function
	(
		tx /* :Knex$Transaction$Optional<T> */
		/* ::, ...args: Array<any> */
	)
		/* :Bluebird$Promise<T> */
	{
		if (is(tx))
		{
			return fn$.apply(this, arguments)
		}
		else if (tx === NOTX)
		{
			return fn$.apply(this, arguments)
		}
		else
		{
			var args = slice.call(arguments)

			return kx.transaction(tx =>
			{
				return fn$.apply(this, [ tx ].concat(args))
			})
		}
	}
}

var NOTX
 = method.NOTX
 = Symbol('NOTX')

/* ::

type $Method
= (<T>(Knex,     $Async$Tx<T>) => $Async<T>)
& (<T>(Knex) => ($Async$Tx<T>) => $Async<T>)

declare module.exports: $Method

*/
