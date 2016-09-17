/* @flow */

var next = 1

var dataset
 = module.exports
 = function dataset
(
	kx     /* :Function & Object */,
	schema /* :Function */,
	data   /* :Array<Object> | Object */
)
{
	var name = 'dataset' + next
	++ next

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
	kx    /* :Function & Object */,
	start /* :number */,
	end   /* :?number */
)
{
	var datarange
	datarange = range(start, end)
	datarange = datarange.map(n => ({ n: n }))

	return dataset(kx, table => table.integer('n'), datarange)
}
