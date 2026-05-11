import extensionsToType from './extensionsToType'

let separator: string = process.platform === 'win32' ? '\\' : '/'

function getRootPrefix (filePath: string): string {
  if (!filePath || filePath.length === 0) return ''
  if (separator === '\\') {
    const driveMatch = /^[a-zA-Z]:\\/.exec(filePath)
    if (driveMatch) return driveMatch[0]
    if (filePath[0] === '\\') return '\\'
    return ''
  }
  return filePath[0] === separator ? separator : ''
}

function dirname (filePath: string): string {
  const lastSep = filePath.lastIndexOf(separator)
  if (lastSep === -1) return '.'
  const root = getRootPrefix(filePath)
  if (lastSep < root.length) return root
  return filePath.slice(0, lastSep)
}

function basename (filePath: string, ext?: string): string {
  const lastSep = filePath.lastIndexOf(separator)
  let base = lastSep === -1 ? filePath : filePath.slice(lastSep + 1)
  if (ext && ext !== base && base.endsWith(ext)) {
    base = base.slice(0, base.length - ext.length)
  }
  return base
}

function extname (filePath: string): string {
  const base = basename(filePath)
  const dotIndex = base.lastIndexOf('.')
  if (dotIndex <= 0) return ''
  return base.slice(dotIndex)
}

interface ParsedPath {
  root: string
  dir: string
  base: string
  ext: string
  name: string
}

function parse (filePath: string): ParsedPath {
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

function join (...parts: Array<string | null | undefined>): string {
  const filtered = parts.filter(
    (part): part is string => part != null && part.length > 0
  )
  if (filtered.length === 0) return '.'
  const rootPrefix = getRootPrefix(filtered[0]!)
  const segments = filtered
    .reduce<string[]>((acc, part) => acc.concat(part.split(separator)), [])
    .filter(seg => seg.length > 0 && seg !== '.')
    .filter(seg => !(separator === '\\' && /^[a-zA-Z]:$/.test(seg)))
  const body = segments.join(separator)
  if (rootPrefix) return rootPrefix + body
  return body.length > 0 ? body : '.'
}

class Path {
  static get separator (): string {
    return separator
  }
  static set separator (value: string) {
    separator = value
  }

  private _root?: string
  private _grandParentDirectory?: string
  private _directoryName?: string
  private _baseName?: string
  private _fileRoot?: string
  private _extension?: string
  private _extensions?: string[]

  constructor (pathObject?: Path.PathLike) {
    const argType = typeof pathObject
    if (argType === 'undefined') {
      return
    }
    else if (argType !== 'object') {
      throw new Error(`Argument must be an object and not "${argType}"`)
    }

    const object: Path.PathLike = Object.assign({}, pathObject)

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

  static fromString (pathString: string): Path {
    const pathInstance = new Path()
    pathInstance.path = pathString
    return pathInstance
  }


  set path (pathString: string) {
    this.directoryPath = dirname(pathString)
    this.fileName = basename(pathString)
  }
  setPath (pathString: string): this {
    this.path = pathString
    return this
  }
  get path (): string {
    return join(this.directoryPath, this.fileName)
  }

  set directoryPath (directoryPath: string) {
    const nativePathObject = parse(directoryPath)
    this._root = nativePathObject.root
    this._grandParentDirectory = nativePathObject.dir
    this._directoryName = nativePathObject.base
  }
  setDirectoryPath (directoryPath: string): this {
    this.directoryPath = directoryPath
    return this
  }
  get directoryPath (): string {
    return join(
      this.root,
      this._grandParentDirectory || '',
      this.directoryName
    )
  }

  set root (root: string) {
    this._root = root
  }
  setRoot (root: string): this {
    this._root = root
    return this
  }
  get root (): string {
    return this._root || ''
  }

  set directoryName (directoryName: string) {
    this._directoryName = directoryName
  }
  setDirectoryName (directoryName: string): this {
    this._directoryName = directoryName
    return this
  }
  get directoryName (): string {
    return this._directoryName || ''
  }

  set fileName (fileName: string) {
    this._extension = extname(fileName)
      .slice(1)
    this._baseName = basename(
      fileName,
      `.${this._extension}`
    )

    this._fileRoot = this._baseName.split('.')[0]
    this._extensions = fileName
      .slice(this._fileRoot!.length + 1)
      .split('.')
  }
  setFileName (fileName: string): this {
    this.fileName = fileName
    return this
  }
  get fileName (): string {
    if (this.fileRoot) {
      return [this.fileRoot]
        .concat(this.extensions)
        .join('.')
    }
    return [this.baseName, this.extension].join('.')
  }

  set baseName (baseName: string) {
    this._baseName = baseName
    this._fileRoot = baseName.split('.')[0]
    const extString = baseName.slice(this.fileRoot.length + 1)
    this._extensions = extString
      ? extString.split('.')
      : []
    this._extensions.push(this.extension)
  }
  setBaseName (baseName: string): this {
    this.baseName = baseName
    return this
  }
  get baseName (): string {
    return [this.fileRoot]
      .concat(this.extensions.slice(0, -1))
      .join('.')
  }

  set extension (extension: string) {
    this._extension = extension
    if (Array.isArray(this._extensions)) this._extensions.pop()
    else this._extensions = []
    this._extensions.push(extension)
  }
  setExtension (extension: string): this {
    this.extension = extension
    return this
  }
  get extension (): string {
    return this._extension || ''
  }

  set fileRoot (fileRoot: string) {
    this._fileRoot = fileRoot
  }
  setFileRoot (fileRoot: string): this {
    this._fileRoot = fileRoot
    return this
  }
  get fileRoot (): string {
    return this._fileRoot || ''
  }

  set extensions (extensions: string[]) {
    this._extensions = extensions
    this._baseName = [this._fileRoot]
      .concat(extensions.slice(0, -1))
      .join('.')
    this._extension = extensions.slice(-1)[0]
  }
  setExtensions (extensions: string[]): this {
    this.extensions = extensions
    return this
  }
  get extensions (): string[] {
    return this._extensions || []
  }

  get fileType (): string | null {
    return extensionsToType(this.extensions)
  }

  toString (): string {
    return this.path
  }

  get toObject (): Path.PathObject {
    const {
      path, root, directoryPath, directoryName, fileName, baseName,
      fileRoot, extensions, extension, fileType,
    } = this

    return {
      path, root, directoryPath, directoryName, fileName, baseName,
      fileRoot, extensions, extension, fileType,
      isDotfile: (this as { isDotfile?: boolean }).isDotfile,
      isAbsolute: (this as { isAbsolute?: boolean }).isAbsolute,
    }
  }
  toJSON (): Path.PathObject {
    return this.toObject
  }
}

namespace Path {
  export interface PathLike {
    path?: string
    root?: string
    directoryPath?: string
    directoryName?: string
    fileName?: string
    baseName?: string
    fileRoot?: string
    extensions?: string[]
    extension?: string
  }

  export interface PathObject {
    path: string
    root: string
    directoryPath: string
    directoryName: string
    fileName: string
    baseName: string
    fileRoot: string
    extensions: string[]
    extension: string
    fileType: string | null
    isDotfile: boolean | undefined
    isAbsolute: boolean | undefined
  }
}

export = Path
