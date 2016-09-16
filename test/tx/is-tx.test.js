/* @flow */

var expect = require('chai').expect

var kx = require('../util/knexconn')()

var istx = require('../../tx/is-tx')

describe('is-tx', () =>
{
	it('is-tx(tx) → true', () =>
	{
		return kx.transaction(tx =>
		{
			expect(istx(tx)).true

			return Promise.resolve()
		})
	})

	it('is-tx(null) → false', () =>
	{
		expect(istx(null)).false
	})

	it('is-tx(undefined) → false', () =>
	{
		expect(istx(void 0)).false
	})

	it('is-tx(false) → false', () =>
	{
		expect(istx(false)).false
	})

	it('is-tx(true) → false', () =>
	{
		expect(istx(true)).false
	})

	it('is-tx({}) → false', () =>
	{
		expect(istx({})).false
	})

	it('is-tx(knex connection) → false', () =>
	{
		expect(istx(kx)).false
	})

	it('is-tx(knex query) → false', () =>
	{
		var query = kx.select('table')

		expect(istx(query)).false
	})

	it('is-tx(object with transaction key) → false', () =>
	{
		expect(istx({ transaction: true })).false
	})
})
