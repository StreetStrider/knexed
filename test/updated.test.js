/* @flow */

var expect = require('chai').expect

var kx = require('./util/knexconn')()
var dataset = require('./util/dataset')
var test_error = require('./util/test-error')

var table  = require('../table/table')

var updated  = require('../updated')

describe('updated', () =>
{
	it('noop if updated', () =>
	{
		var ds = dataset.series(kx, 5)

		return ds
		.then(ds =>
		{
				var name = ds.tableName
				var t = table(kx, name)

				return t()
				.where('n', '=', 1)
				.delete()
				.then(updated)
				.catch(() => expect(false, 'must not throw knexed error').true)
		})
	})
	it('catches deleting too many rows', () =>
	{
		var ds = dataset.series(kx, 5)

		return test_error({ message: 'knexed/updated/more-rows' }, () =>
		{
			return ds
			.then(ds =>
			{
				var name = ds.tableName
				var t = table(kx, name)

				return t()
				.delete()
				.then(updated)
			})
		})
	})

	it('catches deleting too many rows with condition', () =>
	{
		var ds = dataset.series(kx, 5)

		return test_error({ message: 'knexed/updated/more-rows' }, () =>
		{
			return ds
			.then(ds =>
			{
				var name = ds.tableName
				var t = table(kx, name)

				return t()
				.where('n', '>', 2)
				.delete()
				.then(updated)
			})
		})
	})

	it('catches deleting no rows', () =>
	{
		var ds = dataset.series(kx, 5)

		return test_error({ message: 'knexed/updated/no-rows' }, () =>
		{
			return ds
			.then(ds =>
			{
				var name = ds.tableName
				var t = table(kx, name)

				return t()
				.where('n', '>', 100)
				.delete()
				.then(updated)
			})
		})
	})


	it('catches updating too many rows', () =>
	{
		var ds = dataset.series(kx, 5)

		return test_error({ message: 'knexed/updated/more-rows' }, () =>
		{
			return ds
			.then(ds =>
			{
				var name = ds.tableName
				var t = table(kx, name)

				return t()
				.update({ n: 0 })
				.then(updated)
			})
		})
	})

	it('catches updating too many rows with condition', () =>
	{
		var ds = dataset.series(kx, 5)

		return test_error({ message: 'knexed/updated/more-rows' }, () =>
		{
			return ds
			.then(ds =>
			{
				var name = ds.tableName
				var t = table(kx, name)

				return t()
				.where('n', '>', 2)
				.update({ n: 0 })
				.then(updated)
			})
		})
	})

	it('catches updating no rows', () =>
	{
		var ds = dataset.series(kx, 5)

		return test_error({ message: 'knexed/updated/no-rows' }, () =>
		{
			return ds
			.then(ds =>
			{
				var name = ds.tableName
				var t = table(kx, name)

				return t()
				.where('n', '>', 100)
				.update({ n: 0 })
				.then(updated)
			})
		})
	})
})
