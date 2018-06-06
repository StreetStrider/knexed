/* @flow */
/* ::

declare function catch_error (string, Function)
: [ { message: string }, () => void ]

declare function catch_error (string, any, Function)
: [ { message: string }, () => void ]

*/

var predicate = require('./predicate')

module.exports = catch_error

function catch_error (message, data, wrong)
{
	arguments[0] = { message }

	return predicate.apply(this, arguments)
}