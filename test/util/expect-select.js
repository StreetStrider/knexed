/* @flow */

var expect = require('chai').expect

module.exports = function
/* ::<T> */
(
	select /* :Knex$Query */,
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
