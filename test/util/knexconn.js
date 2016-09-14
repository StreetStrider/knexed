
var knex = require('knex')

module.exports = function knexconn ()
{
	return knex(
	{
		client: 'sqlite3',
		connection:
		{
			filename: ':memory:'
		}
	})
}
