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
expected_resultset.left =
[
	{ id: 1, name: 'FOO', id_alt: 1,    mark: 'M1' },
	{ id: 2, name: 'BAR', id_alt: null, mark: null },
	{ id: 3, name: 'BAZ', id_alt: 2,    mark: 'M3' }
]


var ready = Promise.all([ ds1, ds2 ])
var ready_tables = ready
.then(ready =>
{
	var ds1 = table(kx, ready[0].tableName)
	var ds2 = table(kx, ready[1].tableName)

	return [ ds1, ds2 ]
})


var join  = require('../../table/join')
var table = require('../../table/table')

describe('join', () =>
{
	it('join conforms interface', () =>
	{
		expect(join).a('function')
		expect(join.name).equal('join')

		sibling_method(join, 'left')
		sibling_method(join, 'right')
		sibling_method(join, 'full')

		function sibling_method (object, key)
		{
			expect(object).property(key)
			expect(object[key]).a('function')
		}

		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			expect(      join(ds1, ds2, 'id')).a('function')
			expect( join.left(ds1, ds2, 'id')).a('function')
			expect(join.right(ds1, ds2, 'id')).a('function')
			expect( join.full(ds1, ds2, 'id')).a('function')
		})
	})

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
			`select * from \`${ds1.relname()}\` inner join \`${ds2.relname()}\`` +
			` on \`${ds1.relname()}\`.\`id\` = \`${ds2.relname()}\`.\`id\``)

			return expect_select(q, expected_resultset.main)
		})
	})

	it('generates clean join every time', () =>
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
			`select * from \`${ds1.relname()}\` inner join \`${ds2.relname()}\`` +
			` on \`${ds1.relname()}\`.\`id\` = \`${ds2.relname()}\`.\`id\``
			)

			return expect_select(q, expected_resultset.main)
			.then(() =>
			{
				var q = j()
				.where(`${ds1.relname()}.id`, 1)

				expect(q.toQuery())
				.equal(
					`select * from \`${ds1.relname()}\`` +
					` inner join \`${ds2.relname()}\`` +
					` on \`${ds1.relname()}\`.\`id\` = \`${ds2.relname()}\`.\`id\`` +
					` where \`${ds1.relname()}\`.\`id\` = 1`
				)

				return expect_select(q,
				[
					{ id: 1, name: 'FOO', id_alt: 1, mark: 'M1' }
				])
			})
			.then(() =>
			{
				var q = j()
				.where(`${ds1.relname()}.id`, 3)

				expect(q.toQuery())
				.equal(
					`select * from \`${ds1.relname()}\`` +
					` inner join \`${ds2.relname()}\`` +
					` on \`${ds1.relname()}\`.\`id\` = \`${ds2.relname()}\`.\`id\`` +
					` where \`${ds1.relname()}\`.\`id\` = 3`
				)

				return expect_select(q,
				[
					{ id: 3, name: 'BAZ', id_alt: 2, mark: 'M3' }
				])
			})
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
			`select * from \`${ds1.relname()}\` inner join \`${ds2.relname()}\`` +
			` on \`${ds1.relname()}\`.\`id\` = \`${ds2.relname()}\`.\`id\``)

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
				`select \`id_alt\`, \`name\`, \`mark\` from \`${ds1.relname()}\`` +
				` inner join \`${ds2.relname()}\`` +
				` on \`${ds1.relname()}\`.\`id\` = \`${ds2.relname()}\`.\`id_alt\``)

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
			`select * from \`${ds1.relname()}\` inner join \`${ds2.relname()}\`` +
			` on \`${ds1.relname()}\`.\`id\` = \`${ds2.relname()}\`.\`id\``)

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
				`select \`id_alt\`, \`name\`, \`mark\` from \`${ds1.relname()}\`` +
				` inner join \`${ds2.relname()}\`` +
				` on \`${ds1.relname()}\`.\`id\` = \`${ds2.relname()}\`.\`id_alt\``)

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

	it('join.left', () =>
	{
		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			var j = join.left(ds1, ds2, 'id')

			var q = j().select('*', `${ds1.relname()}.id`)

			expect(q.toQuery())
			.equal(
				`select *, \`${ds1.relname()}\`.\`id\` from \`${ds1.relname()}\`` +
				` left join \`${ds2.relname()}\`` +
				` on \`${ds1.relname()}\`.\`id\` = \`${ds2.relname()}\`.\`id\``)

			return expect_select(q, expected_resultset.left)
		})
	})

	it('join.right', () =>
	{
		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			var j = join.right(ds1, ds2, 'id')

			var q = j().select('*', `${ds2.relname()}.id`)

			expect(q.toQuery())
			.equal(
				`select *, \`${ds2.relname()}\`.\`id\` from \`${ds1.relname()}\`` +
				` right join \`${ds2.relname()}\`` +
				` on \`${ds1.relname()}\`.\`id\` = \`${ds2.relname()}\`.\`id\``)

			/*
				// not implemented in SQLite:
				return expect_select(q, [])
			*/
		})
	})

	it('join.full', () =>
	{
		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			var j = join.full(ds1, ds2, 'id')

			var q = j()

			expect(q.toQuery())
			.equal(
				`select * from \`${ds1.relname()}\`` +
				` full outer join \`${ds2.relname()}\`` +
				` on \`${ds1.relname()}\`.\`id\` = \`${ds2.relname()}\`.\`id\``)

			/*
				// not implemented in SQLite:
				return expect_select(q, [])
			*/
		})
	})

	it('join.cross', () =>
	{
		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			var j = join.cross(ds1, ds2)

			var q = j()

			expect(q.toQuery())
			.equal(
			`select * from \`${ds1.relname()}\` cross join \`${ds2.relname()}\``)

			/* another test with relatively small output */
			var j2 = join.cross(ds1, ds2)

			var q = j2()
			.distinct()
			.select(`${ds1.relname()}.id AS id1`)
			.select(`${ds2.relname()}.id AS id2`)
			.select('name')
			.select('mark')
			.orWhere('id1', 1)
			.orWhere(`id2`, 1)

			/* @flow-off */
			return expect_select(q.then(sorted),
				sorted(
				[
					{ id1: 1, id2: 1, name: 'FOO', mark: 'M1' },
					{ id1: 1, id2: 3, name: 'FOO', mark: 'M3' },
					{ id1: 1, id2: 4, name: 'FOO', mark: 'M4' },
//					{ id1: 1, id2: 1, name: 'FOO', mark: 'M1' }, // dup
					{ id1: 2, id2: 1, name: 'BAR', mark: 'M1' },
					{ id1: 3, id2: 1, name: 'BAZ', mark: 'M1' }
				])
			)

			function sorted (rows)
			{
				return rows.sort((L, R) =>
				{
					return (L.id1 * 100 + L.id2) - (R.id1 * 100 + R.id2)
				})
			}
		})
	})

	it('join by single colname with alias', () =>
	{
		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			var j = join([ ds1, 'ds1' ], ds2, 'id')

			var q = j()

			expect(q.toQuery())
			.equal(
				`select * from \`${ds1.relname()}\` as \`ds1\`` +
				` inner join \`${ds2.relname()}\`` +
				` on \`ds1\`.\`id\` = \`${ds2.relname()}\`.\`id\``)

			return expect_select(q, expected_resultset.main)
		})
	})

	it('join by single colname with right alias', () =>
	{
		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			var j = join(ds1, [ ds2, 'ds2' ], 'id')

			var q = j()

			expect(q.toQuery())
			.equal(
				`select * from \`${ds1.relname()}\`` +
				` inner join \`${ds2.relname()}\` as \`ds2\`` +
				` on \`${ds1.relname()}\`.\`id\` = \`ds2\`.\`id\``)

			return expect_select(q, expected_resultset.main)
		})
	})

	it('join by single colname with two aliases', () =>
	{
		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			var j = join([ ds1, 'ds1' ], [ ds2, 'ds2' ], 'id')

			var q = j()

			expect(q.toQuery())
			.equal(
				`select * from \`${ds1.relname()}\` as \`ds1\`` +
				` inner join \`${ds2.relname()}\` as \`ds2\`` +
				` on \`ds1\`.\`id\` = \`ds2\`.\`id\``)

			return expect_select(q, expected_resultset.main)
		})
	})

	it('join by colname pair with two aliases', () =>
	{
		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			var j = join([ ds1, 'ds1' ], [ ds2, 'ds2' ], [ 'id', 'id_alt' ])

			var q = j().select('id_alt', 'name', 'mark')

			expect(q.toQuery())
			.equal(
				`select \`id_alt\`, \`name\`, \`mark\`` +
				` from \`${ds1.relname()}\` as \`ds1\`` +
				` inner join \`${ds2.relname()}\` as \`ds2\`` +
				` on \`ds1\`.\`id\` = \`ds2\`.\`id_alt\``)

			return expect_select(q, expected_resultset.alt)
		})
	})

	it('join.left by colname pair with two aliases', () =>
	{
		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			var j = join.left([ ds1, 'ds1' ], [ ds2, 'ds2' ], 'id')

			var q = j().select('*', `ds1.id`)

			expect(q.toQuery())
			.equal(
				`select *, \`ds1\`.\`id\`` +
				` from \`${ds1.relname()}\` as \`ds1\`` +
				` left join \`${ds2.relname()}\` as \`ds2\`` +
				` on \`ds1\`.\`id\` = \`ds2\`.\`id\``)

			return expect_select(q, expected_resultset.left)
		})
	})

	it('join.cross with two aliases', () =>
	{
		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			var j = join.cross([ ds1, 'ds1' ], [ ds2, 'ds2' ])

			var q = j()

			expect(q.toQuery())
			.equal(
				`select * from \`${ds1.relname()}\` as \`ds1\`` +
				` cross join \`${ds2.relname()}\` as \`ds2\``
			)
		})
	})

	it('join works with tx', () =>
	{
		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			return kx.transaction(tx =>
			{
				var j = join(ds1, ds2, 'id')

				var q = j(tx)

				return expect_select(q, expected_resultset.main)
			})
		})
	})

	it('works with NOTX', () =>
	{
		var no = require('../../tx/method').NOTX

		return ready_tables
		.then(ready =>
		{
			var ds1 = ready[0]
			var ds2 = ready[1]

			var j = join(ds1, ds2, 'id')

			var q = j(no)

			return expect_select(q, expected_resultset.main)
		})
	})
})
