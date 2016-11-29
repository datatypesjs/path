const assert = require('assert')
const betterPath = require('../index.js')
const filePath = '/path/to/a/file.txt'

{
  console.info('returns new path-object') // eslint-disable-line no-console
  const pathObject = betterPath(filePath)

  assert.equal(typeof pathObject, 'object')

  assert.equal(typeof pathObject.path, 'function')
  assert.equal(typeof pathObject.fileName, 'function')
  assert.equal(typeof pathObject.baseName, 'function')
}

{
  console.info('has a path getter') // eslint-disable-line no-console
  const pathObject = betterPath(filePath)

  assert.equal(pathObject.path(), filePath)
}

{
  console.info('has a path setter') // eslint-disable-line no-console
  const pathObject = betterPath(filePath)
  const newPath = '/path/to/another/file.txt'

  pathObject.path(newPath)

  assert.equal(pathObject.path(), newPath)
}
