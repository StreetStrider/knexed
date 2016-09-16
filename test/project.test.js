/* @flow */

var expect = require('chai').expect
// var test_error = require('./util/test-error')

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

describe('project', () =>
{
	it('project(array of objects) → object by ids', () =>
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
})
