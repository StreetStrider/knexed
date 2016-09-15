/* @flow */

module.exports = function dataset (
	kx      /* :Function & Object */,
	schema  /* :Function */,
	data    /* :Array<Object> | Object */
)
{
	return kx.schema.createTable('dataset', schema)
	.then(() =>
	{
		return () => kx('dataset')
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
