/* @flow */
/* ::

declare function catch_constraint (string, Function): () => void

declare function catch_constraint (string, any, Function): () => void

*/

var slice = [].slice

var rethrow = require('./rethrow')

module.exports = catch_constraint

function catch_constraint (constraint, data, wrong)
{
	var args = slice.call(arguments, 1).reverse()

	return (error) =>
	{
		if (Object(error).constraint !== constraint) { throw error }

		rethrow(...args)
	}
}
