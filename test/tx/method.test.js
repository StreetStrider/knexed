/* @flow */

var expect = require('chai').expect

var kx = require('../util/knexconn')()

var is_tx  = require('../../tx/is-tx')
var method = require('../../tx/method')

describe('method', () =>
{
	function res (tx, a, b, c)
	{
		return Promise.resolve([ tx, a, b, c ])
	}

	var m = method(kx, res)

	var m_kx = method(kx)

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

	it('curry', () =>
	{
		var m = m_kx(res)

		return m(1, 2, 3)
		.then(tuple =>
		{
			expect(is_tx(tuple[0])).true
			expect(tuple[1]).equal(1)
			expect(tuple[2]).equal(2)
			expect(tuple[3]).equal(3)
		})
	})

	it('curry pass-thru tx', () =>
	{
		var m = m_kx(res)

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

	it('curry with NOTX', () =>
	{
		var m = m_kx(res)
		var no = method.NOTX

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
