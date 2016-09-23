/* @flow */
/* ::
   import type { Table } from '../tx/table';

   type TableRef = Table;

   export type Predicate
   =   string
   | [ string, string ];
*/

module.exports = function join
(
	left  /* :TableRef */,
	right /* :TableRef */,
	predicate /* :Predicate */
)
/* :Table */
{
	var L = left.relname
	var R = right.relname

	predicate = compile_predicate(L, R, predicate)

	return () =>
	{
		return left().join(R, predicate[0], predicate[1], predicate[2])
	}
}


var isArray  = Array.isArray

function compile_predicate
(
	L /* :string */,
	R /* :string */,
	predicate /* :Predicate */
)
{
	if (typeof predicate === 'string')
	{
		return [
			L + '.' + predicate,
			 '=',
			R + '.' + predicate
		]
	}
	else if (isArray(predicate))
	{
		if (predicate.length === 2)
		{
			return [
				L + '.' + predicate[0],
				 '=',
				R + '.' + predicate[1]
			]
		}
		else if (predicate.length === 3)
		{
			return [
				L + '.' + predicate[0],
				 predicate[1],
				R + '.' + predicate[2]
			]
		}
	}

	throw new TypeError('knexed/join/wrong-predicate')
}
