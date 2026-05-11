const extensionsToType = require('./extensionsToType')

let separator = process.platform === 'win32' ? '\\' : '/'

function getRootPrefix (filePath) {
  if (!filePath || filePath.length === 0) return ''
  if (separator === '\\') {
    const driveMatch = /^[a-zA-Z]:\\/.exec(filePath)
    if (driveMatch) return driveMatch[0]
    if (filePath[0] === '\\') return '\\'
    return ''
  }
  return filePath[0] === separator ? separator : ''
}

function dirname (filePath) {
  const lastSep = filePath.lastIndexOf(separator)
  if (lastSep === -1) return '.'
  const root = getRootPrefix(filePath)
  if (lastSep < root.length) return root
  return filePath.slice(0, lastSep)
}

function basename (filePath, ext) {
  const lastSep = filePath.lastIndexOf(separator)
  let base = lastSep === -1 ? filePath : filePath.slice(lastSep + 1)
  if (ext && ext !== base && base.endsWith(ext)) {
    base = base.slice(0, base.length - ext.length)
  }
  return base
}

function extname (filePath) {
  const base = basename(filePath)
  const dotIndex = base.lastIndexOf('.')
  if (dotIndex <= 0) return ''
  return base.slice(dotIndex)
}

function pathIsAbsolute (filePath) {
  return getRootPrefix(filePath).length > 0
}

function parse (filePath) {
  const root = getRootPrefix(filePath)
  const lastSep = filePath.lastIndexOf(separator)
  const dir = lastSep === -1
    ? ''
    : lastSep < root.length
      ? root
      : filePath.slice(0, lastSep)
  const base = lastSep === -1 ? filePath : filePath.slice(lastSep + 1)
  const dotIndex = base.lastIndexOf('.')
  const ext = dotIndex <= 0 ? '' : base.slice(dotIndex)
  const name = ext ? base.slice(0, base.length - ext.length) : base
  return { root, dir, base, ext, name }
}

function join (...parts) {
  const filtered = parts.filter(part => part != null && part.length > 0)
  if (filtered.length === 0) return '.'
  const rootPrefix = getRootPrefix(filtered[0])
  const segments = filtered
    .reduce((acc, part) => acc.concat(part.split(separator)), [])
    .filter(seg => seg.length > 0 && seg !== '.')
    .filter(seg => !(separator === '\\' && /^[a-zA-Z]:$/.test(seg)))
  const body = segments.join(separator)
  if (rootPrefix) return rootPrefix + body
  return body.length > 0 ? body : '.'
}

module.exports = class Path {
  static get separator () {
    return separator
  }
  static set separator (value) {
    separator = value
  }

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
    this.directoryPath = dirname(pathString)
    this.fileName = basename(pathString)
  }
  setPath (pathString) {
    this.path = pathString
    return this
  }
  get path () {
    return join(this.directoryPath, this.fileName)
  }

  set directoryPath (directoryPath) {
    const nativePathObject = parse(directoryPath)
    this._isAbsolute = pathIsAbsolute(directoryPath)
    this._root = nativePathObject.root
    this._grandParentDirectory = nativePathObject.dir
    this._directoryName = nativePathObject.base
  }
  setDirectoryPath (directoryPath) {
    this.directoryPath = directoryPath
    return this
  }
  get directoryPath () {
    return join(
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
    this._extension = extname(fileName)
      .slice(1)
    this._baseName = basename(
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
    const extString = baseName.slice(this.fileRoot.length + 1)
    this._extensions = extString
      ? extString.split('.')
      : []
    this._extensions.push(this.extension)
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
    this._fileRoot = fileRoot
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
    this.extensions = extensions
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
