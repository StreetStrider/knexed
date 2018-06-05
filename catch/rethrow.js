/* @flow */

module.exports = function rethrow
(
	fn /* :Function */, data /* ::?:any */
)
	/* :() => void */
{
	if (arguments.length < 2)
	{
		return () => { throw fn() }
	}
	else
	{
		return () => { throw fn(data) }
	}
}
