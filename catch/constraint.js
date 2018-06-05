/* @flow */
/* ::

declare function catch_constraint (string, Function)
: [ { constraint: string }, () => void ]

declare function catch_constraint (string, any, Function)
: [ { constraint: string }, () => void ]

*/

function catch_constraint (constraint, data, wrong)
{
	if (arguments.length < 3)
	{
		wrong = data

		return [ { constraint: constraint }, () => { throw wrong() } ]
	}
	else
	{
		return [ { constraint: constraint }, () => { throw wrong(data) } ]
	}
}

module.exports = catch_constraint
