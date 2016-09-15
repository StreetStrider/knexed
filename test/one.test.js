/* @flow */

var expect = require('chai').expect
var test_error = require('./util/test-error')

var kx = require('./util/knexconn')()
var dataset = require('./util/dataset')

describe('one', () =>
{
	var one = require('../one')

	var ds = dataset(kx, table => table.integer('n'),
	[
		{ n: 1 }, { n: 2 }, { n: 3 }
	])

	it('one(rows = 1) → row', () =>
	{
		return ds
		.then(ds =>
		{
			return ds().select().where('n', 1)
		})
		.then(one)
		.then(row =>
		{
			expect(row).an('object')
			expect(row).property('n')
			expect(row.n).a('number')
		})
	})

	it('one(rows = 0) → throws TypeError', () =>
	{
		return test_error({
			message: 'knexed/one/no-rows'
		},
		() =>
		{
			return ds
			.then(ds =>
			{
				return ds().select().where('n', 7)
			})
			.then(one)
		})
	})

	it('one(rows = many) → throws TypeError', () =>
	{
		return test_error({
			message: 'knexed/one/more-rows'
		},
		() =>
		{
			return ds
			.then(ds =>
			{
				return ds().select()
			})
			.then(one)
		})
	})
})
