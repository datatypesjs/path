const path = require('path')

module.exports = (pathElement) => {
  const betterPath = {}
  let pathObject = {}

  function parsePathString (pathString) {
    const fileName = path.basename(pathString)
    const extname = path.extname(pathString)
    const isDotfile = fileName[0] === '.'
    const fileNameParts = fileName.split('.')
    const extensionParts = fileNameParts.slice(isDotfile ? 2 : 1)
    const extension = extensionParts.length > 0
      ? '.' + extensionParts.join('.')
      : ''


    pathObject = {
      path: path.normalize(pathString),
      directoryPath: path.dirname(pathString),
      extension: extension,
      extensionParts: extensionParts.map(ext => {
        // TODO: Reverse order
        return '.' + ext
      }),
      baseName: path.basename(pathString, extension),
      fileName: fileName,
      fileType: extname.slice(1),
      isDotfile: isDotfile,
    }

    pathObject.format = pathObject.fileType
    // TODO: Might break under windows
    pathObject.isAbsolute = pathObject.path.slice(0, 1) === path.delimiter

    return pathObject
  }

  betterPath.path = function (pathString) {

    if (pathString) {
      pathObject = parsePathString(pathString)
      return betterPath
    }
    else {
      return pathObject.path
    }
  }

  betterPath.baseName = function (pathString) {

    if (pathString) {
      throw new Error('Does not yet support setting the baseName value.')
    }
    else {
      return pathObject.baseName
    }
  }

  betterPath.fileName = function (pathString) {

    if (pathString) {
      throw new Error('Does not yet support setting the baseName value.')
    }
    else {
      return pathObject.fileName
    }
  }

  betterPath.toObject = function (localPathObject) {

    if (localPathObject) {
      pathObject = localPathObject
      return betterPath
    }
    else {
      return pathObject
    }
  }

  betterPath.fileType = function (type) {
    if (type) {
      if (pathObject.isDotfile) {
        pathObject = parsePathString(pathObject.path + '.' + type)
      }
      else {
        pathObject = parsePathString(
          pathObject.path.replace(/[^.]*$/, type)
        )
      }

      return betterPath
    }
    else {
      return pathObject.fileType
    }
  }

  betterPath.format = betterPath.fileType


  if (pathElement) {
    if (typeof pathElement === 'string') {
      betterPath.path(pathElement)
      return betterPath
    }
    else {
      betterPath.pathObject(pathElement)
    }
  }

  return betterPath
}
