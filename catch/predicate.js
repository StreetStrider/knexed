/* @flow */
/* ::

declare function predicate<T> (T, Function)
: [ T, () => void ]

declare function predicate<T> (T, any, Function)
: [ T, () => void ]

*/

var rethrow = require('./rethrow')

module.exports = predicate

function predicate (head, data, wrong)
{
	if (arguments.length < 3)
	{
		wrong = (data /* :Function */)

		return [ head, rethrow(wrong) ]
	}
	else
	{
		return [ head, rethrow(wrong, data) ]
	}
}
