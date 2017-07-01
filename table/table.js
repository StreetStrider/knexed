/* @flow */
/* ::
   export type TableFn = (tx :Knex$Transaction$Optional) => Knex$Query;

   export type Table
   = TableFn
   &
   {
     as: (alias :?string, tx :Knex$Transaction$Optional) => Knex$Query,

     relname: (alias :?string) => string,
     +toString: () => string
   };
*/

module.exports = function table (kx /* :Knex */, table_name /* :string */)
	/* :Table */
{
	var t = (tx /* :Knex$Transaction$Optional */) =>
	{
		return transacted(kx, table_name, tx)
	}

	t.as = (alias /* :?string */, tx /* :Knex$Transaction$Optional */) =>
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

function transacted
(
	kx         /* :Knex */,
	table_name /* :string */,
	tx         /* :Knex$Transaction$Optional */
)
	/* :Knex$Query */
{
	return kx(table_name)
	.transacting(tx)
}
