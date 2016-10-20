/* @flow */

module.exports = function exists (query /* :Query */)
	/* :Promise<boolean> */
{
	// var kx = query.client

	return kx.select(kx.raw('exists ? AS existence', query))//.from()
}
