/* @flow */
/* ::

declare function catch_constraint (string, Function)
: [ { constraint: string }, () => void ]

declare function catch_constraint (string, any, Function)
: [ { constraint: string }, () => void ]

*/

var rethrow = require('./rethrow')

module.exports = catch_constraint

function catch_constraint (constraint, data, wrong)
{
	if (arguments.length < 3)
	{
		wrong = (data /* :Function */)

		return [ { constraint: constraint }, rethrow(wrong) ]
	}
	else
	{
		return [ { constraint: constraint }, rethrow(wrong, data) ]
	}
}
