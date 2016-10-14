/* @flow */

var expect = require('chai').expect

var kx = require('../util/knexconn')()
var dataset = require('../util/dataset')

var count = require('../../query/count')

var ds = dataset.series(kx, 1, 4)

describe('query/count', () =>
{
	it('returns actual count on table', () =>
	{
		return ds
		.then(ds =>
		{
			return count(ds())
		})
		.then(c =>
		{
			expect(c).a('number')
			expect(c).equal(3)
		})
	})
})
