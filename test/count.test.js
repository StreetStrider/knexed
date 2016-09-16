/* @flow */

var expect = require('chai').expect

var kx = require('./util/knexconn')()
var dataset = require('./util/dataset')


var count = require('../count')

var ds = dataset.series(kx, 1, 10 + 1)

describe('count', () =>
{
	it('count(rows = 1) → 1', () =>
	{
		return ds
		.then(ds =>
		{
			return ds().select().where('n', 1)
		})
		.then(count)
		.then(n =>
		{
			expect(n).equal(1)
		})
	})
	it('count(rows = 0) → 0', () =>
	{
		return ds
		.then(ds =>
		{
			return ds().select().where('n', -1)
		})
		.then(count)
		.then(n =>
		{
			expect(n).equal(0)
		})
	})
	it('count(rows = n) → n', () =>
	{
		return ds
		.then(ds =>
		{
			return ds().select().where('n', '<=', 5)
		})
		.then(count)
		.then(n =>
		{
			expect(n).equal(5)
		})
	})
})
