/* @flow */

var exists
 = module.exports
 = function exists /* ::<T> */ (rows /* :Array<T> */) /* :boolean */
{
	return rows.length > 0
}

exists.not
 = function exists__not /* ::<T> */ (rows /* :Array<T> */) /* :boolean */
{
	return rows.length === 0
}
