/* @flow */
/* ::

declare function catch_constraint (string, Function)
: [ { constraint: string }, () => void ]

declare function catch_constraint (string, any, Function)
: [ { constraint: string }, () => void ]

*/

var predicate = require('./predicate')

module.exports = catch_constraint

function catch_constraint (constraint, data, wrong)
{
	arguments[0] = { constraint }

	return predicate.apply(this, arguments)
}
