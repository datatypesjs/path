const assert = require('assert')
const Path = require('..')
const fileName = 'file.txt'
const directoryPath = '/path/to/a'
const filePath = `${directoryPath}/${fileName}`
const pathObject = {
  directoryPath: '/path/to/a',
  baseName: 'file',
  extension: 'txt',
}

{
  // eslint-disable-next-line no-console
  console.info('Create empty path instance')
  const emptyPath = new Path()
  const testFile = 'testFile'

  emptyPath.fileRoot = testFile

  assert.strictEqual(emptyPath.baseName, testFile)
  assert.strictEqual(emptyPath.fileName, testFile)
  assert.strictEqual(emptyPath.path, testFile)
}

{
  // eslint-disable-next-line no-console
  console.info('Create path instance from object')
  const pathInstance = new Path(pathObject)

  assert.strictEqual(pathInstance.baseName, 'file')
  assert.strictEqual(pathInstance.fileName, fileName)
  assert.strictEqual(pathInstance.path, filePath)
}

{
  // eslint-disable-next-line no-console
  console.info('Create path instance from string')
  const simplePath = Path.fromString(filePath)

  assert.strictEqual(simplePath.baseName, 'file')
  assert.strictEqual(simplePath.fileName, fileName)
  assert.strictEqual(simplePath.path, filePath)

  const complexPath = Path.fromString('some/temp/path/myfile.md.tar.gz')

  assert.strictEqual(complexPath.baseName, 'myfile.md.tar')
  assert.strictEqual(complexPath.fileRoot, 'myfile')
  assert.deepStrictEqual(complexPath.extensions, ['md', 'tar', 'gz'])
}

{
  // eslint-disable-next-line no-console
  console.info('Change file name')
  const pathInstance = Path.fromString(filePath)
  pathInstance.extension = 'md'

  assert.strictEqual(pathInstance.extension, 'md')
  assert.deepStrictEqual(pathInstance.extensions, ['md'])
  assert.strictEqual(pathInstance.fileName, 'file.md')
  assert.strictEqual(pathInstance.path, `${directoryPath}/file.md`)
}

{
  // eslint-disable-next-line no-console
  console.info('Normalizes extension to generate file type')
  const pathInstance = Path.fromString(`${directoryPath}/file.YML`)

  assert.strictEqual(pathInstance.extension, 'YML')
  assert.strictEqual(pathInstance.fileType, 'yaml')
}

{
  // eslint-disable-next-line no-console
  console.info('Supports conversion to JSON')
  const pathInstance = Path.fromString(`${directoryPath}/file.YML`)

  assert.strictEqual(
    JSON.stringify(pathInstance),
    JSON.stringify({
      path: '/path/to/a/file.YML',
      root: '/',
      directoryPath: '/path/to/a',
      directoryName: 'a',
      fileName: 'file.YML',
      baseName: 'file',
      fileRoot: 'file',
      extensions: [ 'YML' ],
      extension: 'YML',
      fileType: 'yaml',
    })
  )
}

// eslint-disable-next-line no-console
console.info('\nAll tests passed ✔')
