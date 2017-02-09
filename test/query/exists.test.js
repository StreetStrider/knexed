/* @flow */

var expect = require('chai').expect

var kx = require('../util/knexconn')()
var dataset = require('../util/dataset')

var exists = require('../../query/exists')

var ds = dataset.series(kx, 1, 4)

describe.only('query/exists', () =>
{
	it('x', () =>
	{
		return ds
		.then(ds =>
		{
			console.dir(ds().client.raw)
			// console.log('' + ds().client.raw)
			// console.log('' + kx.raw)

			// console.log(ds().client)

			// var qb = ds().client.queryBuilder()
			// console.dir(qb.select('a'))
			// console.dir(qb.select('a').toQuery())

			// console.log(exists(ds()).toQuery())
		})
	})

	it('returns true on non-empty table', () =>
	{
		return ds
		.then(ds =>
		{
			return exists(ds())
		})
		.then(e =>
		{
			expect(e).a('boolean')
			expect(e).equal(true)
		})
	})

	it('returns true on non-empty table subset', () =>
	{
		return ds
		.then(ds =>
		{
			return exists(ds().where('n', '>=', 2))
		})
		.then(e =>
		{
			expect(e).a('boolean')
			expect(e).equal(true)
		})
	})

	it('returns false on empty table subset', () =>
	{
		return ds
		.then(ds =>
		{
			return exists(ds().where('n', '>=', 10))
		})
		.then(e =>
		{
			expect(e).a('boolean')
			expect(e).equal(false)
		})
	})

	it('works on raw', () =>
	{
		return exists(kx.from(kx.raw('(VALUES (1),(2),(3)) AS R')))
		.then(e =>
		{
			expect(e).a('boolean')
			expect(e).equal(true)
		})
	})
})
