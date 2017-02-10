/* @flow */

module.exports = function exists (query /* :Query */)
	/* :Promise<boolean> */
{
	var client = query.client
	var qb = client.queryBuilder()

	return qb.select(client.raw('exists ? AS existence', query))
	.then(rows => Boolean(rows[0].existence))
}
