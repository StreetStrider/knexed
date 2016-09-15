/* @flow */

var one
 = module.exports
 = function one /* ::<T> */ (rows /* :Array<T> */) /* :T */
{
	if (rows.length === 1)
	{
		return rows[0]
	}
	else if (rows.length > 1)
	{
		throw new TypeError('knexed/one/more-rows')
	}
	else
	{
		throw new TypeError('knexed/one/no-rows')
	}
}

one.maybe = () => {}
