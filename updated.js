/* @flow */

module.exports = function updated (n /* :number */)
{
	if (n === 0)
	{
		throw new TypeError('knexed/updated/no-rows')
	}
	else if (n > 1)
	{
		throw new TypeError('knexed/updated/more-rows')
	}
}
