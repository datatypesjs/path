const pathModule = require('path')
const extensionsToType = require('./extensionsToType')

module.exports = class Path {
  constructor (pathObject) {
    const argType = typeof pathObject
    if (argType === 'undefined') {
      return
    }
    else if (argType !== 'object') {
      throw new Error(`Argument must be an object and not "${argType}"`)
    }

    const object = Object.assign({}, pathObject)

    delete object.path
    delete object.fileName

    if (object.directoryPath) {
      delete object.root
      delete object.directoryName
    }

    if (object.extensions) {
      delete object.extension
    }

    if (object.fileRoot) {
      if (object.extensions) {
        delete object.baseName
      }
    }
    else if (!object.baseName) {
      throw new Error('Not enough data to create a path')
    }

    Object.assign(this, pathObject)
  }

  static fromString (pathString) {
    const pathInstance = new Path()
    pathInstance.path = pathString
    return pathInstance
  }


  set path (pathString) {
    this.directoryPath = pathModule.dirname(pathString)
    this.fileName = pathModule.basename(pathString)
  }
  setPath (pathString) {
    this.path = pathString
    return this
  }
  get path () {
    return pathModule.join(this.directoryPath, this.fileName)
  }

  set directoryPath (directoryPath) {
    const nativePathObject = pathModule.parse(directoryPath)
    this._isAbsolute = pathModule.isAbsolute(directoryPath)
    this._root = nativePathObject.root
    this._grandParentDirectory = nativePathObject.dir
    this._directoryName = nativePathObject.base
  }
  setDirectoryPath (directoryPath) {
    return this.directoryPath = directoryPath
  }
  get directoryPath () {
    return pathModule.join(
      this.root,
      this._grandParentDirectory || '',
      this.directoryName
    )
  }

  set root (root) {
    this._root = root
  }
  setRoot (root) {
    this._root = root
    return this
  }
  get root () {
    return this._root || ''
  }

  set directoryName (directoryName) {
    this._directoryName = directoryName
  }
  setDirectoryName (directoryName) {
    this._directoryName = directoryName
    return this
  }
  get directoryName () {
    return this._directoryName || ''
  }

  set fileName (fileName) {
    this._isDotfile = fileName[0] === '.'
    this._extension = pathModule
      .extname(fileName)
      .slice(1)
    this._baseName = pathModule.basename(
      fileName,
      `.${this._extension}`
    )

    this._fileRoot = this._baseName.split('.')[0]
    this._extensions = fileName
      .slice(this._fileRoot.length + 1)
      .split('.')
  }
  setFileName (fileName) {
    this.fileName = fileName
    return this
  }
  get fileName () {
    if (this.fileRoot) {
      return [this.fileRoot]
        .concat(this.extensions)
        .join('.')
    }
    return [this.baseName, this.extension].join('.')
  }

  set baseName (baseName) {
    this._baseName = baseName
    this._fileRoot = baseName.split('.')[0]
    this._extensions = baseName
      .slice(this._fileRoot.length + 1)
      .split('.')
      .push(this._extension)
  }
  setBaseName (baseName) {
    this.baseName = baseName
    return this
  }
  get baseName () {
    return [this.fileRoot]
      .concat(this.extensions.slice(0, -1))
      .join('.')
  }

  set extension (extension) {
    this._extension = extension
    if (Array.isArray(this._extensions)) this._extensions.pop()
    else this._extensions = []
    this._extensions.push(extension)
  }
  setExtension (extension) {
    this.extension = extension
    return this
  }
  get extension () {
    return this._extension || ''
  }

  set fileRoot (fileRoot) {
    this._fileRoot = fileRoot
  }
  setFileRoot (fileRoot) {
    this.fileRoot = fileRoot
    return this
  }
  get fileRoot () {
    return this._fileRoot || ''
  }

  set extensions (extensions) {
    this._extensions = extensions
    this._basename = [this._fileRoot]
      .concat(extensions.slice(0, -1))
      .join('.')
    this._extension = extensions.slice(-1)[0]
  }
  setExtensions (extensions) {
    this._extensions = extensions
    return this
  }
  get extensions () {
    return this._extensions || []
  }

  get fileType () {
    return extensionsToType(this.extensions)
  }

  toString () {
    return this.path
  }

  get toObject () {
    const {
      path, root, directoryPath, directoryName, fileName, baseName,
      fileRoot, extensions, extension, fileType, isDotfile, isAbsolute,
    } = this

    return {
      path, root, directoryPath, directoryName, fileName, baseName,
      fileRoot, extensions, extension, fileType, isDotfile, isAbsolute,
    }
  }
  toJSON () {
    return this.toObject
  }
}
