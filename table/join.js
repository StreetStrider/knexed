/* @flow */
/* ::

import type { TableFn, Table } from '../table/table'
import type { Knex$Transaction$Optional } from '../tx/method'

type Join = Table

type TableRef
= Alias
| Table

type Alias = [ Table, string ]

export type Predicate
= [ string, Operator, string ]
| [ string, string ]
|   string

type Operator
= '='
| '>'
| '<'
| '>='
| '<='
| '<>'
| '!='

*/

var join   = module.exports = join_by_type('innerJoin')

join.left  = join_by_type('leftJoin')
join.right = join_by_type('rightJoin')
join.full  = join_by_type('fullOuterJoin')


function join_by_type (join_type /* :string */)
{
	return function join
	(
		left  /* :TableRef | Join */,
		right /* :TableRef */,
		predicate /* :Predicate */
	)
		/* :Join */
	{
		var tableL = pick_table(left)
		var tableR = pick_table(right)

		var asL = pick_actual_alias(left)
		var asR = pick_actual_alias(right)

		var $predicate = compile_predicate(asL, asR, predicate)

		function $join (tx /* :Knex$Transaction$Optional<any> */)
		{
			return tableL
			.as(asL, tx)[join_type](
				tableR.relname(asR),
				$predicate[0], $predicate[1], $predicate[2]
			)
		}

		table_like($join, tableL.kx, asL)

		return $join
	}
}


join.cross = function cross_join (left /* :TableRef */, right /* :TableRef */)
	/* :Join */
{
	var tableL = pick_table(left)
	var tableR = pick_table(right)

	var asL = pick_actual_alias(left)
	var asR = pick_actual_alias(right)

	function $join (tx /* :Knex$Transaction$Optional<any> */)
	{
		return tableL
		.as(asL, tx)
		.crossJoin(tableR.relname(asR))
	}

	table_like($join, tableL.kx, asL)

	return $join
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
				/* @flow-off */
				R + '.' + predicate[2]
			]
		}
	}

	throw new TypeError('knexed/join/wrong-predicate')
}


function table_like ($join, kx, relname)
{
	$join.kx = kx
	$join.relname = () => relname
	/* @flow-off */
	$join.as = (...args) => $join(...args.slice(1))
	/* @flow-off */
	$join.toString = () => $join.relname()
}
