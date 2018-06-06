/* @flow */

var expect = require('chai').expect

var kx = require('../util/knexconn')()
var dataset = require('../util/dataset')
var test_error = require('../util/test-error')

var table  = require('../../table/table')
var catch_error  = require('../../catch/error')

function prep_error ()
{
	return new Error('foo')
}

describe('error', () =>
{
	it('catches', () =>
	{
		/* @flow-off */
		var ds = dataset.keyvalue(kx, 'id', { 1: 'a', 2: 'b' })

		var r = ds
		.then(ds =>
		{
			var name = ds.tableName
			var t = table(kx, name)

			var constraint = `insert into \`${ name }\` (\`id\`, \`value\`)` +
			` values (1, 'c')` +
			` - SQLITE_CONSTRAINT: UNIQUE constraint failed: ${ name }.id`

			return t()
			.insert({ id: 1, value: 'c' })
			.catch(...catch_error(constraint, prep_error))
		})

		return test_error({ message: 'foo' }, () => r)
	})

	it('catches with data', () =>
	{
		/* @flow-off */
		var ds = dataset.keyvalue(kx, 'id', { 1: 'a', 2: 'b' })

		function prep_wrong (data)
		{
			return { error: 'foo', data: data }
		}

		var id = 17

		return ds
		.then(ds =>
		{
			var name = ds.tableName
			var t = table(kx, name)

			var constraint = `insert into \`${ name }\` (\`id\`, \`value\`)` +
			` values (1, 'c')` +
			` - SQLITE_CONSTRAINT: UNIQUE constraint failed: ${ name }.id`

			return t()
			.insert({ id: 1, value: 'c' })
			.catch(...catch_error(constraint, { id: id }, prep_wrong))
		})
		.then(() =>
		{
			expect(false, 'must throw knexed error').true
		},
		(wrong) =>
		{
			expect(wrong).an('object')
			expect(wrong.error).eq('foo')
			expect(wrong.data).deep.eq({ id: id })
		})
	})


	it('passes', () =>
	{
		/* @flow-off */
		var ds = dataset.keyvalue(kx, 'id', { 1: 'a', 2: 'b' })

		return ds
		.then(ds =>
		{
			var name = ds.tableName
			var t = table(kx, name)

			var error = `insert into \`${ name }\` (\`id\`, \`value\`)` +
			` values (1, 'c')` +
			` - SQLITE_CONSTRAINT: UNIQUE constraint failed: ${ name }.id`

			var r = t()
			.insert({ id: 1, value: 'c' })
			.catch(...catch_error('another_error', prep_error))

			return test_error({ error: error }, () => r)
		})
	})
})
