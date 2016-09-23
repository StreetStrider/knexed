/* @flow */

var expect = require('chai').expect

var kx = require('../util/knexconn')()
var dataset = require('../util/dataset')
var expect_select = require('../util/expect-select')

var ds1 = dataset(kx, table =>
{
	table.integer('id').primary()
	table.string('name')
},
[
	{ id: 1, name: 'FOO' },
	{ id: 2, name: 'BAR' },
	{ id: 3, name: 'BAZ' }
])

var ds2 = dataset(kx, table =>
{
	table.integer('id').primary()
	table.string('mark')
},
[
	{ id: 1, mark: 'M1' },
	{ id: 3, mark: 'M3' },
	{ id: 4, mark: 'M4' }
])

var ready = Promise.all([ ds1, ds2 ])
var ready_tables = ready
.then(ready =>
{
	var ds1 = table(kx, ready[0].tableName)
	var ds2 = table(kx, ready[1].tableName)

	return [ ds1, ds2 ]
})


var join  = require('../../join/join')
var table = require('../../tx/table')

describe('join', () =>
{
	it('works', () =>
	{
		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			var j = join(ds1, ds2, 'id')

			var q = j()

			expect(q.toQuery())
			.equal(
				`select * from "${ds1.relname}" inner join "${ds2.relname}"` +
				` on "${ds1.relname}"."id" = "${ds2.relname}"."id"`)

			return expect_select(q,
			[
				{ id: 1, name: 'FOO', mark: 'M1' },
				{ id: 3, name: 'BAZ', mark: 'M3' }
			])
		})
	})
})
