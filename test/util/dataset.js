/* @flow */
/* ::

import type { Knex } from 'knex'

*/

var next = 1

var dataset
 = module.exports
 = function dataset
(
	kx     /* :Knex */,
	schema /* :Function */,
	data   /* :Array<Object> | Object */
)
{
	var name = 'dataset' + next
	++next

	return kx.schema.createTable(name, schema)
	.then(() =>
	{
		var ds = () => kx(name)

		ds.tableName = name

		return ds
	})
	.then(ds =>
	{
		return ds().insert(data)
		.then(() =>
		{
			return ds
		})
	})
}


var range = require('lodash/range')

dataset.series = function series
(
	kx    /* :Knex */,
	start /* :number */,
	end   /* :?number */
)
{
	var datarange
	datarange = range(start, end)
	datarange = datarange.map(n => ({ n: n }))

	return dataset(kx, table => table.integer('n'), datarange)
}


var map = require('lodash/map')

dataset.keyvalue = function keyvalue
(
	kx      /* :Knex */,
	keyname /* :string */,
	kv      /* { [ key: number ]: string } */
)
{
	var data = map(kv, (v, k) =>
	{
		var it =
		{
			value: v
		}

		it[keyname] = k

		return it
	})

	return dataset(kx,
	table =>
	{
		table.integer(keyname).primary()
		table.string('value')
	}
	, data)
}
