/* @flow */

var expect = require('chai').expect
var noop = require('lodash/noop')

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

			return expect_select(
				t().select().where('n', 1),
				[ { n: 1 } ]
			)
		})
	})

	it('works with tx', () =>
	{
		return ds
		.then(ds =>
		{
			var name = ds.tableName

			var t = table(kx, name)

			return kx.transaction(tx =>
			{
				return Promise.resolve()
				.then(() =>
				{
					return expect_select(
						t(tx).select().where('n', 5),
						[]
					)
				})
				.then(() =>
				{
					return t(tx).insert({ n: 5 })
				})
				.then(() =>
				{
					return expect_select(
						t(tx).select().where('n', 5),
						[ { n: 5 } ]
					)
				})
				.then(() =>
				{
					throw Error('rollback')
				})
			})
			.catch(noop)
			.then(() =>
			{
				return expect_select(
					t().select().where('n', 5),
					[]
				)
			})
		})
	})

	it('works with NOTX', () =>
	{
		var no = require('../../tx/method').NOTX

		return ds
		.then(ds =>
		{
			var name = ds.tableName

			var t = table(kx, name)

			return expect_select(
				t(no).select().where('n', 1),
				[ { n: 1 } ]
			)
		})
	})
})

describe('table.as', () =>
{
	it('generates new this table based query with alias', () =>
	{
		return ds
		.then(ds =>
		{
			var name = ds.tableName

			var t = table(kx, name)

			var q = t.as('alias').select().where('n', 1)

			expect(q.toQuery())
			.equal(`select * from "${name}" as "alias" where "n" = 1`)

			return expect_select(
				q,
				[ { n: 1 } ]
			)
		})
	})

	it('works with alias, tx', () =>
	{
		return ds
		.then(ds =>
		{
			var name = ds.tableName

			var t = table(kx, name)

			return kx.transaction(tx =>
			{
				var q = t.as('alias', tx).select().where('n', 1)

				expect(q.toQuery())
				.equal(`select * from "${name}" as "alias" where "n" = 1`)

				return expect_select(
					q,
					[ { n: 1 } ]
				)
			})
		})
	})

	it('works with alias, NOTX', () =>
	{
		var no = require('../../tx/method').NOTX

		return ds
		.then(ds =>
		{
			var name = ds.tableName

			var t = table(kx, name)

			var q = t.as('alias', no).select().where('n', 1)

			expect(q.toQuery())
			.equal(`select * from "${name}" as "alias" where "n" = 1`)

			return expect_select(
				q,
				[ { n: 1 } ]
			)
		})
	})
})

function expect_select (select, rows)
{
	return select
	.then(rows_real =>
	{
		expect(rows_real).an('array')
		expect(rows_real).eql(rows)
	})
}
