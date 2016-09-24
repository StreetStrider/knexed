/* @flow */
/* ::
   export type Table = (tx :TransactionOptional) => Query;

   export type TableAs = Table &
   {
     as: (alias :?string, tx :TransactionOptional) => Query,

     relname: (alias :?string) => string
   };
*/

module.exports = function table (kx /* :Knex */, table_name /* :string */)
/* :TableAs */
{
	var t = (tx /* :TransactionOptional */) =>
	{
		return transacted(kx, table_name, tx)
	}

	t.as = (alias /* :?string */, tx /* :TransactionOptional */) =>
	{
		return transacted(kx, relname(alias), tx)
	}

	var relname = t.relname = (alias /* :?string */) =>
	{
		if (alias)
		{
			return table_name + ' as ' + alias
		}
		else
		{
			return table_name
		}
	}

	return t
}

function transacted (
	kx         /* :Knex */,
	table_name /* :string */,
	tx         /* :TransactionOptional */
)
/* :Query */
{
	return kx(table_name)
	.transacting(tx)
}
