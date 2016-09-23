/* @flow */
/* ::
   export type Table = (tx :TransactionOptional) => Query;

   export type TableAlias = Table &
   {
     as: (alias :string, tx :TransactionOptional) => Query,

     relname: string
   };
*/

module.exports = function table (kx /* :Knex */, table_name /* :string */)
/* :TableAlias */
{
	var t = (tx /* :TransactionOptional */) =>
	{
		return transacted(kx, table_name, tx)
	}

	t.relname = table_name

	t.as = (alias /* :string */, tx /* :TransactionOptional */) =>
	{
		return transacted(kx, (table_name + ' as ' + alias), tx)
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
