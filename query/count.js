/* @flow */
/* ::

import type { $QueryBuilder } from 'knex'

*/

module.exports = function count (query /* :$QueryBuilder<any> */)
	/* :Promise<number> */
{
	return query.count('* as count')
	.then(rows => Number(rows[0].count))
}
