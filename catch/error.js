/* @flow */
/* ::

declare function catch_error (string, Function): () => void

declare function catch_error (string, any, Function): () => void

*/

var slice = [].slice

var rethrow = require('./rethrow')

module.exports = catch_error

function catch_error (message, data, wrong)
{
	var args = slice.call(arguments, 1).reverse()

	return (error) =>
	{
		if (Object(error).message !== message) { throw error }

		rethrow(...args)
	}
}
