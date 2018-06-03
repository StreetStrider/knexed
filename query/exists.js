/* @flow */
/* ::

import type { $QueryBuilder } from 'knex'

*/

module.exports = function exists (query /* :$QueryBuilder<any> */)
	/* :Bluebird$Promise<boolean> */
{
	var client = query.client
	var qb = client.queryBuilder()

	return qb.select(client.raw('exists ? AS existence', query))
	.then(rows => Boolean(rows[0].existence))
}
