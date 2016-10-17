/* @flow */

var expect = require('chai').expect

var kx = require('../util/knexconn')()
var dataset = require('../util/dataset')

var count = require('../../query/count')

var ds = dataset.series(kx, 1, 4)

describe('query/count', () =>
{
	it('returns actual count on table', () =>
	{
		return ds
		.then(ds =>
		{
			return count(ds())
		})
		.then(c =>
		{
			expect(c).a('number')
			expect(c).equal(3)
		})
	})

	it('returns count on table subset', () =>
	{
		return ds
		.then(ds =>
		{
			return count(ds().where('n', '>=', 2))
		})
		.then(c =>
		{
			expect(c).a('number')
			expect(c).equal(2)
		})
	})

	it('returns zero for empty subset', () =>
	{
		return ds
		.then(ds =>
		{
			return count(ds().where('n', '>=', 10))
		})
		.then(c =>
		{
			expect(c).a('number')
			expect(c).equal(0)
		})
	})

	it('works on raw', () =>
	{
		return count(kx.from(kx.raw('(VALUES (1),(2),(3)) AS R')))
		.then(c =>
		{
			expect(c).a('number')
			expect(c).equal(3)
		})
	})
})
