/* @flow */
/* ::
   type TableRef = string;
   type Pred     = string;
*/

module.exports = function join
(
	kx    /* :Knex */,
	left  /* :TableRef */,
	right /* :TableRef */,
	pred  /* :Pred */
)
{
	return () =>
	{
		return kx(left).join(right, left + '.' + pred, '=', right + '.' + pred)
	}
}
