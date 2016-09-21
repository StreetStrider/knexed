/* @flow */

module.exports = function table (kx /* :Knex */, table_name /* :string */)
{
	return (tx /* :TransactionOptional */) =>
	{
		return kx(table_name)
		.transacting(tx)
	}
}
