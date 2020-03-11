/* @flow */

module.exports = function rethrow
(
	fn /* :Function */, data /* ::?:any */
)
	/* :void */
{
	if (arguments.length < 2)
	{
		throw fn()
	}
	else
	{
		throw fn(data)
	}
}
