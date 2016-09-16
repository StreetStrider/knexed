/* @flow */

module.exports = function is_tx (tx /* :any */) /* :boolean */
{
	return Boolean(tx && tx.transaction && tx.savepoint)
}
