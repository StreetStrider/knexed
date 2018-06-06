/* @flow */

var kx = require('./util/knexconn')()
var dataset = require('./util/dataset')
var expect_select = require('./util/expect-select')


var table  = require('../table/table')
var upsert = require('../upsert')


describe('upsert', () =>
{
	it('insert', () =>
	{
		/* @flow-off */
		var ds = dataset.keyvalue(kx, 'id', { 1: 'a', 2: 'b' })

		return ds
		.then(ds =>
		{
			var name = ds.tableName
			var t = table(kx, name)
			var u = upsert(t)

			return u(3, { value: 'c' })
			.then(() =>
			{
				return expect_select(t(),
				[
					{ id: 1, value: 'a' },
					{ id: 2, value: 'b' },
					{ id: 3, value: 'c' },
				])
			})
		})
	})

	it('insert, custom key', () =>
	{
		/* @flow-off */
		var ds = dataset.keyvalue(kx, 'key', { 1: 'x', 2: 'y' })

		return ds
		.then(ds =>
		{
			var name = ds.tableName
			var t = table(kx, name)
			var u = upsert(t,
			{
				key: (key) => ({ key })
			})

			return u(3, { value: 'z' })
			.then(() =>
			{
				return expect_select(t(),
				[
					{ key: 1, value: 'x' },
					{ key: 2, value: 'y' },
					{ key: 3, value: 'z' },
				])
			})
		})
	})

	it('update', () =>
	{
		/* @flow-off */
		var ds = dataset.keyvalue(kx, 'id', { 1: 'a', 2: 'b' })

		return ds
		.then(ds =>
		{
			var name = ds.tableName
			var t = table(kx, name)
			var u = upsert(t)

			return u(2, { value: 'c' })
			.then(() =>
			{
				return expect_select(t(),
				[
					{ id: 1, value: 'a' },
					{ id: 2, value: 'c' },
				])
			})
		})
	})

	it('update, custom key', () =>
	{
		/* @flow-off */
		var ds = dataset.keyvalue(kx, 'key', { 1: 'x', 2: 'y' })

		return ds
		.then(ds =>
		{
			var name = ds.tableName
			var t = table(kx, name)
			var u = upsert(t,
			{
				key: (key) => ({ key })
			})

			return u(2, { value: 'z' })
			.then(() =>
			{
				return expect_select(t(),
				[
					{ key: 1, value: 'x' },
					{ key: 2, value: 'z' },
				])
			})
		})
	})
})
