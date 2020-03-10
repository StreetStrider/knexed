/* @flow */
/* ::

import type { Knex } from 'knex'
import type { $QueryBuilder } from 'knex'

import type { Knex$Transaction$Optional } from '../tx/method'

export type Table =
{
  (tx :Knex$Transaction$Optional<any>): $QueryBuilder<any>,
  as(alias :?string, tx :Knex$Transaction$Optional<any>): $QueryBuilder<any>,

  relname(alias :?string): string,
  toString(): string,

  kx: Knex,
}

*/

// TODO: generic
module.exports = function table (kx /* :Knex */, table_name /* :string */)
	/* :Table */
{
	var t = (tx /* :Knex$Transaction$Optional<any> */) =>
	{
		return transacted(kx, table_name, tx)
	}

	t.kx = kx

	t.as = (alias /* :?string */, tx /* :Knex$Transaction$Optional<any> */) =>
	{
		return transacted(kx, relname(alias), tx)
	}

	var relname = t.relname = (alias /* :?string */) =>
	{
		if (alias)
		{
			if (alias !== table_name)
			{
				return table_name + ' as ' + alias
			}
		}

		return table_name
	}

	/* @flow-off */
	t.toString = () =>
	{
		return relname()
	}

	return t
}


var NOTX = require('../tx/method').NOTX

// TODO: generic
function transacted
(
	kx         /* :Knex */,
	table_name /* :string */,
	tx         /* :Knex$Transaction$Optional<any> */
)
	/* :$QueryBuilder<any> */
{
	var q = kx(table_name)

	if (! tx)
	{
		return q
	}
	if (tx === NOTX)
	{
		return q
	}

	/* @flow-off */
	/* :: tx = (tx :Knex$Transaction$Optional<any>) */

	return q.transacting(tx)
}
