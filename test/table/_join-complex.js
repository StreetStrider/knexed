
// var expect = require('chai').expect

var kx = require('../util/knexconn')()
var dataset = require('../util/dataset')
var expect_select = require('../util/expect-select')
// var test_error = require('../util/test-error')

var ds1 = dataset(kx, table =>
{
	table.integer('id').primary()
	table.string('name')
},
[
	{ id: 1, name: 'AAA' },
	{ id: 2, name: 'BBB' },
	{ id: 3, name: 'CCC' },
	{ id: 4, name: 'DDD' },
])

var ds2 = dataset(kx, table =>
{
	table.integer('id').primary()
	table.string('type')
},
[
	{ id: 1, type: 'middle' },
])

var ds3 = dataset(kx, table =>
{
	table.integer('id').primary()
	table.string('right_name')
},
[
	{ id: 1, right_name: 'R1' },
	{ id: 2, right_name: 'R2' },
	{ id: 3, right_name: 'R3' },
])


var ready = Promise.all([ ds1, ds2, ds3 ])
var ready_tables = ready
.then(ready =>
{
	var ds1 = table(kx, ready[0].tableName)
	var ds2 = table(kx, ready[1].tableName)
	var ds3 = table(kx, ready[2].tableName)

	return [ ds1, ds2, ds3 ]
})


// var join  = require('../../table/join')
var table = require('../../table/table')

it('(ds1 ↔ ds2) ↔ ds3 on ds2=ds3', () =>
{
	return ready_tables
	.then(ready =>
	{
		var ds1 = ready[0]
		var ds2 = ready[1]
		var ds3 = ready[2]

		var q = kx.raw(`SELECT * FROM ${ds1} INNER JOIN ${ds2} ON ${ds1}.id = ${ds2}.id INNER JOIN ${ds3} ON ${ds1}.id = ${ds3}.id`)

		// var ds1$ds2 = join(ds1, ds2, 'id')

		return expect_select(q,
		[
			{ id: 1, name: 'AAA', type: 'middle', right_name: 'R1' },
		])
	})
})

it('(ds1 ← ds2) ↔ ds3 on ds1=ds3', () =>
{
	return ready_tables
	.then(ready =>
	{
		var ds1 = ready[0]
		var ds2 = ready[1]
		var ds3 = ready[2]

		var q = kx.raw(`SELECT * FROM ${ds1} LEFT JOIN ${ds2} ON ${ds1}.id = ${ds2}.id INNER JOIN ${ds3} ON ${ds1}.id = ${ds3}.id`)

		// var ds1$ds2 = join(ds1, ds2, 'id')

		return expect_select(q,
		[
			{ id: 1, name: 'AAA', type: 'middle', right_name: 'R1' },
			{ id: 2, name: 'BBB', type:     null, right_name: 'R2' },
			{ id: 3, name: 'CCC', type:     null, right_name: 'R3' },
		])
	})
})

it('(ds1 ← ds2) ↔ ds3 on ds2=ds3', () =>
{
	return ready_tables
	.then(ready =>
	{
		var ds1 = ready[0]
		var ds2 = ready[1]
		var ds3 = ready[2]

		var q = kx.raw(`SELECT * FROM ${ds1} LEFT JOIN ${ds2} ON ${ds1}.id = ${ds2}.id INNER JOIN ${ds3} ON ${ds2}.id = ${ds3}.id`)

		// var ds1$ds2 = join(ds1, ds2, 'id')

		return expect_select(q,
		[
			{ id: 1, name: 'AAA', type: 'middle', right_name: 'R1' },
		])
	})
})

it('(ds1 ↔ ds3) ← ds2 on ds1=ds2', () =>
{
	return ready_tables
	.then(ready =>
	{
		var ds1 = ready[0]
		var ds2 = ready[1]
		var ds3 = ready[2]

		var q = kx.raw(`SELECT *, ${ds1}.id AS id FROM ${ds1} INNER JOIN ${ds3} ON ${ds1}.id = ${ds3}.id LEFT JOIN ${ds2} ON ${ds1}.id = ${ds2}.id`)

		// var ds1$ds2 = join(ds1, ds2, 'id')

		return expect_select(q,
		[
			{ id: 1, name: 'AAA', type: 'middle', right_name: 'R1' },
			{ id: 2, name: 'BBB', type:     null, right_name: 'R2' },
			{ id: 3, name: 'CCC', type:     null, right_name: 'R3' },
		])
	})
})

it('(ds1 ↔ ds3) ← ds2 on ds3=ds2', () =>
{
	return ready_tables
	.then(ready =>
	{
		var ds1 = ready[0]
		var ds2 = ready[1]
		var ds3 = ready[2]

		var q = kx.raw(`SELECT *, ${ds1}.id AS id  FROM ${ds1} INNER JOIN ${ds3} ON ${ds1}.id = ${ds3}.id LEFT JOIN ${ds2} ON ${ds3}.id = ${ds2}.id`)

		// var ds1$ds2 = join(ds1, ds2, 'id')

		return expect_select(q,
		[
			{ id: 1, name: 'AAA', type: 'middle', right_name: 'R1' },
			{ id: 2, name: 'BBB', type:     null, right_name: 'R2' },
			{ id: 3, name: 'CCC', type:     null, right_name: 'R3' },
		])
	})
})

it('(ds1 × ds2) ↔ ds3 on ds1=ds3', () =>
{
	return ready_tables
	.then(ready =>
	{
		var ds1 = ready[0]
		var ds2 = ready[1]
		var ds3 = ready[2]

		var q = kx.raw(`SELECT * FROM ${ds1} CROSS JOIN ${ds2} INNER JOIN ${ds3} ON ${ds1}.id = ${ds3}.id`)

		// var ds1$ds2 = join(ds1, ds2, 'id')

		return expect_select(q,
		[
			{ id: 1, name: 'AAA', type: 'middle', right_name: 'R1' },
			{ id: 2, name: 'BBB', type: 'middle', right_name: 'R2' },
			{ id: 3, name: 'CCC', type: 'middle', right_name: 'R3' },
		])
	})
})

it('(ds1 × ds2) ↔ ds3 on ds2=ds3', () =>
{
	return ready_tables
	.then(ready =>
	{
		var ds1 = ready[0]
		var ds2 = ready[1]
		var ds3 = ready[2]

		var q = kx.raw(`SELECT * FROM ${ds1} CROSS JOIN ${ds2} INNER JOIN ${ds3} ON ${ds2}.id = ${ds3}.id`)

		// var ds1$ds2 = join(ds1, ds2, 'id')

		return expect_select(q,
		[
			{ id: 1, name: 'AAA', type: 'middle', right_name: 'R1' },
			{ id: 1, name: 'BBB', type: 'middle', right_name: 'R1' },
			{ id: 1, name: 'CCC', type: 'middle', right_name: 'R1' },
			{ id: 1, name: 'DDD', type: 'middle', right_name: 'R1' },
		])
	})
})
