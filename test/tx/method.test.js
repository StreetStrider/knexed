/* @flow */

var expect = require('chai').expect

var kx = require('../util/knexconn')()

var is_tx  = require('../../tx/is-tx')
var method = require('../../tx/method')

describe('method', () =>
{
	var m = method(kx, (tx, a, b, c) =>
	{
		return Promise.resolve([ tx, a, b, c ])
	})

	it('pass new tx to fn', () =>
	{
		return m(1, 2, 3)
		.then(tuple =>
		{
			expect(is_tx(tuple[0])).true
			expect(tuple[1]).equal(1)
			expect(tuple[2]).equal(2)
			expect(tuple[3]).equal(3)
		})
	})

	it('pass-thru tx to fn', () =>
	{
		return kx.transaction(tx =>
		{
			return m(tx, 1, 2, 3)
			.then(tuple =>
			{
				expect(is_tx(tuple[0])).true
				expect(tuple[1]).equal(1)
				expect(tuple[2]).equal(2)
				expect(tuple[3]).equal(3)
			})
		})
	})

	it('works with NOTX', () =>
	{
		var no = method.NOTX

		expect(no).a('symbol')

		return m(no, 1, 2, 3)
		.then(tuple =>
		{
			expect(tuple[0]).equal(no)
			expect(tuple[1]).equal(1)
			expect(tuple[2]).equal(2)
			expect(tuple[3]).equal(3)
		})
	})
})
