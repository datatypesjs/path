var assert = require('assert'),
	betterPath = require('../index.js'),
	filePath = '/path/to/a/file.txt',
	directoryPath = '/path/to/some/files'


describe('Better Path', function () {

	it('returns new path-object', function () {

		var pathObject = betterPath(filePath)

		assert.equal(typeof pathObject, 'object')

		assert.equal(typeof pathObject.path, 'function')
		assert.equal(typeof pathObject.fileName, 'function')
		assert.equal(typeof pathObject.baseName, 'function')
	})


	it('has a path getter', function () {

		var pathObject = betterPath(filePath)

		assert.equal(pathObject.path(), filePath)
	})


	it('has a path setter', function () {

		var pathObject = betterPath(filePath),
			newPath = '/path/to/another/file.txt'

		pathObject.path(newPath)

		assert.equal(pathObject.path(), newPath)
	})
})
