/* @flow */
/* ::

import type { $QueryBuilder } from 'knex'

*/

var expect = require('chai').expect

module.exports = function
/* ::<T> */
(
	select /* :$QueryBuilder<T> */,
	rows   /* :Array<T> */
)
{
	return select
	.then(rows_real =>
	{
		expect(rows_real).an('array')
		expect(rows_real).eql(rows)
	})
}
