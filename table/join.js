/* @flow */
/* ::
   import type { TableFn, Table } from '../table/table';

   type Join = TableFn;

   type TableRef
   = Alias
   | Table
   ;

   type Alias = [ Table, string ];


   type TableRefComplex
   = Join
   | JoinWithSide
   | TableRef
   ;

   type JoinWithSide = [ Join, JoinSide ];

   type JoinSide = SideFirst | SideSecond;

   type SideFirst  = Symbol;
   type SideSecond = Symbol;


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

var join   = module.exports = join_by_type('innerJoin')

join.left  = join_by_type('leftJoin')
join.right = join_by_type('rightJoin')
join.full  = join_by_type('fullOuterJoin')


join.side = {}

var FIRST  /* :SideFirst  */ = join.side.FIRST  = Symbol('FIRST')
var SECOND /* :SideSecond */ = join.side.SECOND = Symbol('SECOND')

function join_by_type (join_type /* :string */)
{
	return function join
	(
		left  /* :TableRefComplex */,
		right /* :TableRef */,
		predicate /* :Predicate */
	)
		/* :Join */
	{
		var tableL = pick_table(left)
		var tableR = pick_table(right)

		var asL = pick_actual_alias(left)
		var asR = pick_actual_alias(right)

		predicate = compile_predicate(asL, asR, predicate)

		return (tx /* :TransactionOptional */) =>
		{
			return tableL
			.as(asL, tx)[join_type](
				tableR.relname(asR),
				predicate[0], predicate[1], predicate[2]
			)
		}
	}
}


join.cross = function cross_join (left /* :TableRef */, right /* :TableRef */)
	/* :Join */
{
	var tableL = pick_table(left)
	var tableR = pick_table(right)

	var asL = pick_actual_alias(left)
	var asR = pick_actual_alias(right)

	return (tx /* :TransactionOptional */) =>
	{
		return tableL
		.as(asL, tx)
		.crossJoin(tableR.relname(asR))
	}
}


function pick_table (table /* :TableRef */) /* :Table */
{
	if (Array.isArray(table))
	{
		return table[0]
	}
	else
	{
		return table
	}
}

function pick_actual_alias (table /* :TableRef */) /* :string */
{
	if (Array.isArray(table))
	{
		return table[1]
	}
	else
	{
		return table.relname()
	}
}

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
	else if (Array.isArray(predicate))
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
