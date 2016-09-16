/* @flow */

var expect = require('chai').expect
var test_error = require('./util/test-error')

var kx = require('./util/knexconn')()
var dataset = require('./util/dataset')


var project = require('../project')

var ds = dataset(kx, table =>
{
	table.integer('id').primary()
	table.string('value')
},
[
	{ id: 1, value: 'value_1' },
	{ id: 2, value: 'value_2' },
	{ id: 3, value: 'value_3' }
])

var ds_dup = dataset(kx, table =>
{
	table.integer('id')
	table.string('value')
},
[
	{ id: 1, value: 'value_1' },
	{ id: 2, value: 'value_2' },
	{ id: 3, value: 'value_3' },
	{ id: 3, value: 'value_4' }
])

describe('project', () =>
{
	it('project(key)(rows = n) → object by ids', () =>
	{
		return ds
		.then(ds =>
		{
			return ds().select()
		})
		.then(project('id'))
		.then(proj =>
		{
			expect(proj).an('object')

			expect(proj).property('1')
			expect(proj).property('2')
			expect(proj).property('3')

			/* eslint-disable quote-props */
			expect(proj).eql({
				'1': { value: 'value_1' },
				'2': { value: 'value_2' },
				'3': { value: 'value_3' }
			})
			/* eslint-enable quote-props */
		})
	})

	it('project(key)(rows = 0) → {}', () =>
	{
		return ds
		.then(ds =>
		{
			return ds().select().where('id', 7)
		})
		.then(project('id'))
		.then(proj =>
		{
			expect(proj).an('object')
			expect(proj).empty
		})
	})

	it('project(key)(rows with dups) → throws TypeError', () =>
	{
		return test_error({ message: 'knexed/project/keyval-duplicate' }, () =>
		{
			return ds_dup
			.then(ds =>
			{
				return ds().select()
			})
			.then(project('id'))
		})
	})

	it('project(wrong key)(rows = n) → throws TypeError', () =>
	{
		return test_error({ message: 'knexed/project/key-not-present' }, () =>
		{
			return ds
			.then(ds =>
			{
				return ds().select()
			})
			.then(project('wrong_key'))
		})
	})

	it('project(wrong key)(rows = 0) → {}', () =>
	{
		return ds
		.then(ds =>
		{
			return ds().select().where('id', 7)
		})
		.then(project('wrong_key'))
		.then(proj =>
		{
			expect(proj).an('object')
			expect(proj).empty
		})
	})

	it('project(wrong key)(rows with dups) → throws TypeError', () =>
	{
		return test_error({ message: 'knexed/project/key-not-present' }, () =>
		{
			return ds_dup
			.then(ds =>
			{
				return ds().select()
			})
			.then(project('wrong_key'))
		})
	})
})
