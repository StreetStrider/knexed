/* @flow */

module.exports = function table (kx /* :Knex */, table_name /* :string */)
{
	var t = (tx /* :TransactionOptional */) =>
	{
		return transacted(kx, table_name, tx)
	}

	t.as = (alias /* :string */, tx /* :TransactionOptional */) =>
	{
		return transacted(kx, aliased(table_name, alias), tx)
	}

	return t
}

function transacted (kx /* :Knex */, table_name /* :string */, tx /* :TransactionOptional */)
{
	return kx(table_name)
	.transacting(tx)
}

function aliased (name /* :string */, alias /* :string */)
{
	return name + ' as ' + alias
}
