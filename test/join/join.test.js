/* @flow */

var expect = require('chai').expect

var kx = require('../util/knexconn')()
var dataset = require('../util/dataset')
var expect_select = require('../util/expect-select')
var test_error = require('../util/test-error')

var ds1 = dataset(kx, table =>
{
	table.integer('id').primary()
	table.string('name')
},
[
	{ id: 1, name: 'FOO' },
	{ id: 2, name: 'BAR' },
	{ id: 3, name: 'BAZ' }
])

var ds2 = dataset(kx, table =>
{
	table.integer('id').primary()
	table.integer('id_alt').unique()
	table.string('mark')
},
[
	{ id: 1, id_alt: 1, mark: 'M1' },
	{ id: 3, id_alt: 2, mark: 'M3' },
	{ id: 4, id_alt: 3, mark: 'M4' }
])

var expected_resultset = {}
expected_resultset.main =
[
	{ id: 1, name: 'FOO', id_alt: 1, mark: 'M1' },
	{ id: 3, name: 'BAZ', id_alt: 2, mark: 'M3' }
]
expected_resultset.alt =
[
	{ id_alt: 1, name: 'FOO', mark: 'M1' },
	{ id_alt: 2, name: 'BAR', mark: 'M3' },
	{ id_alt: 3, name: 'BAZ', mark: 'M4' }
]


var ready = Promise.all([ ds1, ds2 ])
var ready_tables = ready
.then(ready =>
{
	var ds1 = table(kx, ready[0].tableName)
	var ds2 = table(kx, ready[1].tableName)

	return [ ds1, ds2 ]
})


var join  = require('../../join/join')
var table = require('../../tx/table')

describe('join', () =>
{
	it('join by single colname', () =>
	{
		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			var j = join(ds1, ds2, 'id')

			var q = j()

			expect(q.toQuery())
			.equal(
				`select * from "${ds1.relname}" inner join "${ds2.relname}"` +
				` on "${ds1.relname}"."id" = "${ds2.relname}"."id"`)

			return expect_select(q, expected_resultset.main)
		})
	})

	it('join by colname pair [ id, id ]', () =>
	{
		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			var j = join(ds1, ds2, [ 'id', 'id' ])

			var q = j()

			expect(q.toQuery())
			.equal(
				`select * from "${ds1.relname}" inner join "${ds2.relname}"` +
				` on "${ds1.relname}"."id" = "${ds2.relname}"."id"`)

			return expect_select(q, expected_resultset.main)
		})
	})

	it('join by colname pair [ id, id_alt ]', () =>
	{
		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			var j = join(ds1, ds2, [ 'id', 'id_alt' ])

			var q = j().select('id_alt', 'name', 'mark')

			expect(q.toQuery())
			.equal(
				`select "id_alt", "name", "mark" from "${ds1.relname}"` +
				` inner join "${ds2.relname}"` +
				` on "${ds1.relname}"."id" = "${ds2.relname}"."id_alt"`)

			return expect_select(q, expected_resultset.alt)
		})
	})

	it('join by colname pair with predicate [ id, =, id ]', () =>
	{
		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			var j = join(ds1, ds2, [ 'id', '=', 'id' ])

			var q = j()

			expect(q.toQuery())
			.equal(
				`select * from "${ds1.relname}" inner join "${ds2.relname}"` +
				` on "${ds1.relname}"."id" = "${ds2.relname}"."id"`)

			return expect_select(q, expected_resultset.main)
		})
	})

	it('join by colname pair with predicate [ id, =, id_alt ]', () =>
	{
		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			var j = join(ds1, ds2, [ 'id', 'id_alt' ])

			var q = j().select('id_alt', 'name', 'mark')

			expect(q.toQuery())
			.equal(
				`select "id_alt", "name", "mark" from "${ds1.relname}"` +
				` inner join "${ds2.relname}"` +
				` on "${ds1.relname}"."id" = "${ds2.relname}"."id_alt"`)

			return expect_select(q, expected_resultset.alt)
		})
	})

	it('throws when unknown predicate (number)', () =>
	{
		return test_error({ message: 'knexed/join/wrong-predicate' }, () =>
		{
			return ready_tables
			.then(ready =>
			{
				var ds1 = ready[0]
				var ds2 = ready[1]

				/* @flow-off */
				return join(ds1, ds2, 15)() /* test `number` */
			})
		})
	})

	it('throws when unknown predicate (Object)', () =>
	{
		return test_error({ message: 'knexed/join/wrong-predicate' }, () =>
		{
			return ready_tables
			.then(ready =>
			{
				var ds1 = ready[0]
				var ds2 = ready[1]

				/* @flow-off */
				return join(ds1, ds2, {})() /* test `Object` */
			})
		})
	})

	it('throws when unknown predicate ([4])', () =>
	{
		return test_error({ message: 'knexed/join/wrong-predicate' }, () =>
		{
			return ready_tables
			.then(ready =>
			{
				var ds1 = ready[0]
				var ds2 = ready[1]

				/* @flow-off */
				return join(ds1, ds2, [ 'id', '=', 'id', 'id_alt' ])()
			})
		})
	})

	it('throws when unknown predicate ([1])', () =>
	{
		return test_error({ message: 'knexed/join/wrong-predicate' }, () =>
		{
			return ready_tables
			.then(ready =>
			{
				var ds1 = ready[0]
				var ds2 = ready[1]

				/* @flow-off */
				return join(ds1, ds2, [ 'id' ])() /* test single item */
			})
		})
	})


	it('throws when unknown predicate ([0])', () =>
	{
		return test_error({ message: 'knexed/join/wrong-predicate' }, () =>
		{
			return ready_tables
			.then(ready =>
			{
				var ds1 = ready[0]
				var ds2 = ready[1]

				/* @flow-off */
				return join(ds1, ds2, [])() /* test empty array */
			})
		})
	})
})
