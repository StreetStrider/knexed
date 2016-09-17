/* @flow */

module.exports = function table (kx /* :Knex */, table_name /* :string */)
{
	return () =>
	{
		return kx(table_name)
	}
}
