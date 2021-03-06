/* @flow */

var expect = require('chai').expect

var kx = require('../util/knexconn')()
var dataset = require('../util/dataset')

var exists = require('../../query/exists')

var ds = dataset.series(kx, 1, 4)

describe('query/exists', () =>
{
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

	it('works with tx', () =>
	{
		return ds
		.then(ds =>
		{
			var dst = (tx) => ds().transacting(tx)

			return kx.transaction(tx =>
			{
				return Promise.resolve()
				.then(() =>
				{
					return exists(dst(tx).where('n', '>=', 10))
				})
				.then(e =>
				{
					expect(e).a('boolean')
					expect(e).equal(false)
				})
				.then(() =>
				{
					return dst(tx).insert({ n: 11 })
				})
				.then(() =>
				{
					return exists(dst(tx).where('n', '>=', 10))
				})
				.then(e =>
				{
					expect(e).a('boolean')
					expect(e).equal(true)
				})
			})
		})
	})
})
