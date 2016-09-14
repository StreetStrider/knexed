
module.exports = function dataset (kx, schema, data)
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
