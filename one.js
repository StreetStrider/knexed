/* @flow */

var one
 = module.exports
 = function one /* ::<T> */ (rows /* :Array<T> */) /* :T */
{
	if (rows.length === 1)
	{
		return rows[0]
	}
	else if (rows.length === 0)
	{
		throw new TypeError('knexed/one/no-rows')
	}
	else
	{
		throw new TypeError('knexed/one/more-rows')
	}
}

one.maybe
 = function one__maybe /* ::<T> */ (rows /* :Array<T> */) /* :?T */
{
	if (rows.length === 1)
	{
		return rows[0]
	}
	else if (rows.length === 0)
	{
		return null
	}
	else
	{
		throw new TypeError('knexed/one/more-rows')
	}
}
