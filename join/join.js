/* @flow */
/* ::
   type TableRef = Table;
   type Pred     = string;

   import type { Table } from '../tx/table';
*/

module.exports = function join
(
	left  /* :TableRef */,
	right /* :TableRef */,
	pred  /* :Pred */
)
/* :Table */
{
	return () =>
	{
		var rel_l = left.relname
		var rel_r = right.relname

		return left().join(rel_r, rel_l + '.' + pred, '=', rel_r + '.' + pred)
	}
}
