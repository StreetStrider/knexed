/* @flow */
/* ::

import type { Knex } from 'knex'

type RetPromise<T>
= (                         ...args: Array<any>) => Promise<T>

type TxRetPromise<T>
= (tx: Knex$Transaction<T>, ...args: Array<any>) => Promise<T>

*/

var slice = [].slice

var is = require('./is-tx')

var method
 = module.exports
 = function method /* ::<T> */
(
	kx /* :Knex */,
	fn /* :TxRetPromise<T> */
)
	/* :RetPromise<T> */
{
	return function
	(
		tx /* :Knex$Transaction$Optional<T> */
		/* ::, ...args: Array<any> */
	)
		/* :Promise<T> */
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
