/* @flow */

var raw = require('knex').raw

var knexconn = require('./util/knexconn')()

knexconn.select(raw('current_timestamp as ts'))
// .debug()
.then(console.log, console.error)

describe('one', () =>
{

	it('works with array', () =>
	{
		// var rows = [ { x: 1 } ]
	})

})
