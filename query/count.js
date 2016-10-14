/* @flow */

module.exports = function count (query /* :Query */)
	/* :Promise<number> */
{
	return query.count('* as count')
	.then(rows => Number(rows[0].count))
}
