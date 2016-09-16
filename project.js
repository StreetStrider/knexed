/* @flow */

var extend = Object.assign

module.exports = function project (key /* :string */)
{
	/* :: type Projection = Object */

	return (rows /* :Array<Object> */) /* :Projection */ =>
	{
		if (! rows.length)
		{
			return {}
		}

		var first = rows[0]

		if (! (key in first))
		{
			throw TypeError('knexed/project/key-not-present')
		}

		var proj = {}

		rows.forEach(row =>
		{
			var keyval = row[key]

			if (keyval in proj)
			{
				throw TypeError('knexed/project/keyval-duplicate')
			}

			var value = extend({}, row)

			delete value[key]

			proj[keyval] = value
		})

		return proj
	}
}
