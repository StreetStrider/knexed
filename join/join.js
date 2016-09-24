/* @flow */
/* ::
   import type { Table } from '../tx/table';

   type TableRef = Table;

   export type Predicate
   = [ string, Operator, string ]
   | [ string, string ]
   |   string
   ;

   type Operator
   = '='
   | '>'
   | '<'
   | '>='
   | '<='
   | '<>'
   | '!='
   ;
*/

var join   = module.exports = join_by_predicate('innerJoin')

join.left  = join_by_predicate('leftJoin')
join.right = join_by_predicate('rightJoin')
join.full  = join_by_predicate('fullOuterJoin')


function join_by_predicate (join_type /* :string */)
{
	return function join
	(
		left  /* :TableRef */,
		right /* :TableRef */,
		predicate /* :Predicate */
	)
	/* :Table */
	{
		var L = left.relname()
		var R = right.relname()

		predicate = compile_predicate(L, R, predicate)

		return () =>
		{
			return left()[join_type](R, predicate[0], predicate[1], predicate[2])
		}
	}
}


join.cross = function cross_join (left /* :TableRef */, right /* :TableRef */)
{
	var R = right.relname()

	return () =>
	{
		return left().crossJoin(R)
	}
}


var isArray  = Array.isArray

function compile_predicate
(
	L /* :string */,
	R /* :string */,
	predicate /* :Predicate */
)
/* : [ string, string, string ] */
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
