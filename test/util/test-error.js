/* @flow */

var expect = require('chai').expect

module.exports = function test_error (
	pattern /* :ErrorPattern */,
	fn      /* :FnPromise */
)
	/* :Promise<void> */
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
		pattern.message && expect(error.message).equal(pattern.message)
		pattern.constraint && expect(error.constraint).equal(pattern.constraint)
	})
}
