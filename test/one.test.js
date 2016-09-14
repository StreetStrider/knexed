/* @flow */

var kx = require('./util/knexconn')()
var dataset = require('./util/dataset')

var ds = dataset(kx, table =>
{
	table.integer('n')
},
[
	{ n: 1 }, { n: 2 }, { n: 3 }
])

ds.then(ds =>
{
	return ds().select()
})
.then(console.log, console.error)

describe('one', () =>
{

	it('works with array', () =>
	{
		// var rows = [ { x: 1 } ]
	})

})
