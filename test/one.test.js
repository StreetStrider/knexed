/* @flow */

var raw = require('knex').raw

var knexconn = require('./util/knexconn')()

knexconn.schema.createTable('dataset', table =>
{
	table.integer('n')
})
.then(() =>
{
	return knexconn('dataset')
	.insert([ { n: 1 }, { n: 2 }, { n: 3 }])
})
.then(() =>
{
	return knexconn('dataset').select()
})
.then(console.log, console.error)

describe('one', () =>
{

	it('works with array', () =>
	{
		// var rows = [ { x: 1 } ]
	})

})
