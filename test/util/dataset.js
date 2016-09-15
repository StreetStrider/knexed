/* @flow */

var next = 1

module.exports = function dataset (
	kx      /* :Function & Object */,
	schema  /* :Function */,
	data    /* :Array<Object> | Object */
)
{
	var name = 'dataset' + next
	++ next

	return kx.schema.createTable(name, schema)
	.then(() =>
	{
		return () => kx(name)
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
