/* @flow */

var expect = require('chai').expect

var kx = require('./util/knexconn')()
var dataset = require('./util/dataset')


var exists = require('../exists')

var ds = dataset.series(kx, 1, 4)

describe('exists', () =>
{
	it('exists(rows = n) → true', () =>
	{
		return ds
		.then(ds =>
		{
			return ds().select()
		})
		.then(exists)
		.then(so =>
		{
			expect(so).true
		})
	})

	it('exists(rows = 1) → true', () =>
	{
		return ds
		.then(ds =>
		{
			return ds().select().where('n', 1)
		})
		.then(exists)
		.then(so =>
		{
			expect(so).true
		})
	})

	it('exists(rows = 0) → false', () =>
	{
		return ds
		.then(ds =>
		{
			return ds().select().where('n', 7)
		})
		.then(exists)
		.then(so =>
		{
			expect(so).false
		})
	})
})
