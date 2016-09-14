/* @flow */

var assert = require('assert')

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
	var one = require('../one')

	it('works with array', () =>
	{
		return ds
		.then(ds =>
		{
			return ds().select().where('n', 1)
		})
		.then(one)
		.then(row =>
		{
			assert(typeof row === 'object')
			assert(row.n === 1)
		})
	})
})
