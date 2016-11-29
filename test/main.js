/* eslint-disable no-console */
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
  console.info('Creates empty path instance')
  const emptyPath = new Path()
  const testFile = 'testFile'

  emptyPath.fileRoot = testFile

  assert.strictEqual(emptyPath.baseName, testFile)
  assert.strictEqual(emptyPath.fileName, testFile)
  assert.strictEqual(emptyPath.path, testFile)
}

{
  console.info('Creates path instance from object')
  const pathInstance = new Path(pathObject)

  assert.strictEqual(pathInstance.baseName, 'file')
  assert.strictEqual(pathInstance.fileName, fileName)
  assert.strictEqual(pathInstance.path, filePath)
}

{
  console.info('Creates path instance from simple path string')
  const simplePath = Path.fromString(filePath)

  assert.strictEqual(simplePath.baseName, 'file')
  assert.strictEqual(simplePath.fileName, fileName)
  assert.strictEqual(simplePath.path, filePath)
}

{
  console.info('Creates path instance from complex path string')
  const complexPath = Path.fromString('some/temp/path/myfile.md.tar.gz')

  assert.strictEqual(complexPath.baseName, 'myfile.md.tar')
  assert.strictEqual(complexPath.fileRoot, 'myfile')
  assert.deepStrictEqual(complexPath.extensions, ['md', 'tar', 'gz'])
}

{
  console.info('Changes the extension')
  const pathInstance = Path.fromString(filePath)
  pathInstance.extension = 'md'

  assert.strictEqual(pathInstance.extension, 'md')
  assert.deepStrictEqual(pathInstance.extensions, ['md'])
  assert.strictEqual(pathInstance.fileName, 'file.md')
  assert.strictEqual(pathInstance.path, `${directoryPath}/file.md`)
}

{
  console.info('Changes all extensions')
  const pathInstance = Path.fromString(filePath)
  pathInstance.extensions = ['coffee', 'md']

  assert.deepStrictEqual(pathInstance.extensions, ['coffee', 'md'])
  assert.strictEqual(pathInstance.extension, 'md')
}

{
  console.info('Provides setProperty() methods for all properties')
  const pathInstance = Path.fromString(filePath)

  pathInstance
    .setDirectoryPath('some/directory')
    .setRoot('/')
    .setFileRoot('the-story')
    .setExtension('rtf')

  assert.strictEqual(pathInstance.path, '/some/directory/the-story.rtf')

  pathInstance
    .setPath('somewhere/entirely/else.doc')
    .setDirectoryName('almostEntirely')
    .setExtensions(['md', 'epub'])
    .setFileName('elseif.odf')
    .setBaseName('if.txt')

  assert.strictEqual(pathInstance.path, 'somewhere/almostEntirely/if.txt.odf')
}

{
  console.info('Normalizes extension to generate file type')
  const pathInstance = Path.fromString(`${directoryPath}/file.YML`)

  assert.strictEqual(pathInstance.extension, 'YML')
  assert.strictEqual(pathInstance.fileType, 'yaml')
}

{
  console.info('Converts path instance to a string')
  const pathInstance = Path.fromString(filePath)
  const actualSentence = `The file ${pathInstance} is important`
  const expectedSentence = 'The file /path/to/a/file.txt is important'

  assert.strictEqual(actualSentence, expectedSentence)
}

{
  console.info('Converts path instance to JSON')
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

console.info('\nAll tests passed ✔')
