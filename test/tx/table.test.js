/* @flow */

var expect = require('chai').expect

var kx = require('../util/knexconn')()
var dataset = require('../util/dataset')

var table = require('../../tx/table')

var ds = dataset.series(kx, 1, 4)

describe('table', () =>
{
	it('generates new this table based query', () =>
	{
		return ds
		.then(ds =>
		{
			var name = ds.tableName

			var t = table(kx, name)

			return t().select().where('n', 1)
		})
		.then(rows =>
		{
			expect(rows).eql(
			[
				{ n: 1 }
			])
		})
	})
})
