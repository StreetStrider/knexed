/* @flow */
/* ::

type Options<Key> =
{
	key: (Key) => Object,
}

import type { Table } from './table/table'

*/

var assign = Object.assign

var method = require('./tx/method')
var exists = require('./exists')

var defaults =
{
	key: (id) => ({ id }),
}

module.exports = function upsert /* ::<Key, Data: Object> */
(
	table   /* :Table */,
	options /* :?Options<Key> */
)
{
	var kx = table.kx
	var $options /* :Options<Key> */ = assign({}, defaults, options)

	return method/* ::<Data> */(kx, (tx, key /* :Key */, data /* :Data */) =>
	{
		var data_compose = assign($options.key(key), data)

		return byId(table, tx, key)
		.then(exists)
		.then(so =>
		{
			if (so)
			{
				return byId(table, tx, key)
				.update(data)
			}
			else
			{
				return table(tx)
				.insert(data_compose)
			}
		})
		.then(() => data_compose)
	})

	function byId (table, tx, key /* :Key */)
	{
		return table(tx)
		.where($options.key(key))
	}
}
