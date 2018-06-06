/* @flow */
/* ::

declare function catch_error (string, Function)
: [ { message: string }, () => void ]

declare function catch_error (string, any, Function)
: [ { message: string }, () => void ]

*/

var rethrow = require('./rethrow')

module.exports = catch_error

function catch_error (message, data, wrong)
{
	if (arguments.length < 3)
	{
		wrong = (data /* :Function */)

		return [ { message: message }, rethrow(wrong) ]
	}
	else
	{
		return [ { message: message }, rethrow(wrong, data) ]
	}
}
