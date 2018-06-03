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
= (tx: Knex$Transaction<T>, ...args: Array<any>) => Bluebird$Promise<T>

*/

var slice = [].slice

var is = require('./is-tx')

var method
 = module.exports
 = function method /* ::<T> */
(
	kx /* :Knex */,
	fn /* :$Async$Tx<T> */
)
	/* :$Async<T> */
{
	return function
	(
		tx /* :Knex$Transaction$Optional<T> */
		/* ::, ...args: Array<any> */
	)
		/* :Bluebird$Promise<T> */
	{
		if (is(tx))
		{
			return fn.apply(this, arguments)
		}
		else if (tx === NOTX)
		{
			return fn.apply(this, arguments)
		}
		else
		{
			var args = slice.call(arguments)

			return kx.transaction(tx =>
			{
				return fn.apply(this, [ tx ].concat(args))
			})
		}
	}
}

var NOTX
 = method.NOTX
 = Symbol('NOTX')
