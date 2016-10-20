/* @flow */

var expect = require('chai').expect

var kx = require('../util/knexconn')()
var dataset = require('../util/dataset')

var exists = require('../../query/exists')

var ds = dataset.series(kx, 1, 4)

describe('query/exists', () =>
{
	it.only('x', () =>
	{
		return ds
		.then(ds =>
		{
			// console.dir(ds().client.raw)
			// console.log('' + ds().client.raw)
			// console.log('' + kx.raw)

			// console.dir(ds())
			console.dir(ds().client)
			console.dir(ds().distinct)
			console.dir(kx.select)
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
