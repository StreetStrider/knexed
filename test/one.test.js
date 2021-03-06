/* @flow */

var expect = require('chai').expect
var test_error = require('./util/test-error')

var kx = require('./util/knexconn')()
var dataset = require('./util/dataset')


var one = require('../one')

var ds = dataset.series(kx, 1, 4)

describe('one', () =>
{
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

describe('one.maybe', () =>
{
	it('one.maybe(rows = 1) → row', () =>
	{
		return ds
		.then(ds =>
		{
			return ds().select().where('n', 1)
		})
		.then(one.maybe)
		.then(row =>
		{
			expect(row).an('object')
			expect(row).property('n')
			expect(row.n).a('number')
		})
	})

	it('one.maybe(rows = 0) → null', () =>
	{
		return ds
		.then(ds =>
		{
			return ds().select().where('n', 7)
		})
		.then(one.maybe)
		.then(row =>
		{
			expect(row).null
		})
	})

	it('one.maybe(rows = many) → throws TypeError', () =>
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
			.then(one.maybe)
		})
	})
})
