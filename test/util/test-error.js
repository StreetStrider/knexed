/* @flow */

var expect = require('chai').expect

module.exports = function test_error (
	pattern /* :ErrorPattern */,
	fn      /* :FnPromise */
)
{
	return fn()
	.then(
	() =>
	{
		expect(false, 'must throw knexed error').true
	},
	error =>
	{
		expect(error).an('error')
		expect(error.message).equal(pattern.message)
	})
}
