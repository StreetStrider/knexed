/* @flow */

var expect = require('chai').expect
var noop = require('lodash/noop')

var kx = require('../util/knexconn')()
var dataset = require('../util/dataset')
var expect_select = require('../util/expect-select')


var table = require('../../tx/table')

var ds = dataset.series(kx, 1, 4)

describe('table', () =>
{
	it('table conforms interface', () =>
	{
		expect(table).a('function')
		expect(table.name).equal('table')

		var t = table(kx, 'T')

		expect(t).a('function')

		expect(t).property('relname')
		expect(t.relname).a('function')

		expect(t).property('as')
		expect(t.as).a('function')
	})

	it('relname, relname with alias', () =>
	{
		var t = table(kx, 'T')

		expect(t.relname()).equal('T')
		expect(t.relname('A')).equal('T as A')
	})

	it('generates new this table based query', () =>
	{
		return ds
		.then(ds =>
		{
			var name = ds.tableName

			var t = table(kx, name)

			var q = t().select().where('n', 1)

			expect(q.toQuery())
			.equal(`select * from "${name}" where "n" = 1`)

			return expect_select(q, [ { n: 1 } ])
		})
	})

	it('generates clean query every time', () =>
	{
		return ds
		.then(ds =>
		{
			var name = ds.tableName

			var t = table(kx, name)

			var q = t().select().where('n', 1)

			expect(q.toQuery())
			.equal(`select * from "${name}" where "n" = 1`)

			return expect_select(q, [ { n: 1 } ])
			.then(() =>
			{
				var q = t().select().where('n', 2)

				expect(q.toQuery())
				.equal(`select * from "${name}" where "n" = 2`)

				return expect_select(q, [ { n: 2 } ])
			})
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

