/* @flow */
/* ::
type RetPromise<T>   = (                 ...args: Array<any>) => Promise<T>;
type RetPromiseTx<T> = (tx: Transaction, ...args: Array<any>) => Promise<T>;
*/

var slice = [].slice

var is = require('./is-tx')

var method
 = module.exports
 = function method /* ::<T> */
(
	kx /* :Knex */,
	fn /* :RetPromiseTx<T> */
)
	/* :RetPromise<T> */
{
	return function
	(
		tx /* :?Transaction */
		/* ::, ...args: Array<any> */
	)
		/* :Promise<T> */
	{
		if (is(tx))
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
