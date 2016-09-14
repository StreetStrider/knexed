
var knex = require('knex')
var raw  = knex.raw

var knexconn = knex(
{
	client: 'sqlite3',
	connection:
	{
		filename: ':memory:'
	}
})

knexconn.select(raw('current_timestamp as ts'))
// .debug()
.then(console.log, console.error)

describe('one', () =>
{

	it('works with array', () =>
	{
		var rows = [ {x:1} ]
	})

})
