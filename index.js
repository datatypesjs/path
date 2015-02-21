var path = require('path')


module.exports = function (pathElement) {

	var betterPath = {},
		pathObject = {}

	function parsePathString (pathString) {

		var fileName = path.basename(pathString),
			extname = path.extname(pathString),
			isDotfile = (fileName[0] === '.'),
			fileNameParts = fileName.split('.'),
			extensionParts = fileNameParts.slice(isDotfile ? 2 : 1),
			extension = (extensionParts.length > 0) ?
			            '.' + extensionParts.join('.') : ''


		pathObject = {
			path: path.normalize(pathString),
			directoryPath: path.dirname(pathString),
			extension: extension,
			extensionParts: extensionParts.map(function (ext) {
				// TODO: Reverse order
				return '.' + ext
			}),
			baseName: path.basename(pathString, extension),
			fileName: fileName,
			fileType: extname.slice(1),
			isDotfile: isDotfile
		}

		pathObject.format = pathObject.fileType
		// TODO: Might break under windows
		pathObject.isAbsolute = (pathObject.path.slice(0, 1) === path.delimiter)

		return pathObject
	}

	betterPath.path = function (pathString) {

		if (pathString) {
			pathObject = parsePathString(pathString)
			return betterPath
		}
		else
			return pathObject.path
	}

	betterPath.baseName = function (pathString) {

		if (pathString) {
			throw new Error('Does not yet support setting the baseName value.')
		}
		else
			return pathObject.baseName
	}

	betterPath.fileName = function (pathString) {

		if (pathString) {
			throw new Error('Does not yet support setting the baseName value.')
		}
		else
			return pathObject.fileName
	}

	betterPath.toObject = function (localPathObject) {

		if (localPathObject) {
			pathObject = localPathObject
			return betterPath
		}
		else
			return pathObject
	}

	betterPath.fileType = function (type) {
		if (type) {
			if (pathObject.isDotfile)
				pathObject = parsePathString(pathObject.path + '.' + type)
			else
				pathObject = parsePathString(
					pathObject.path.replace(/[^.]*$/, type)
				)

			return betterPath
		}
		else
			return pathObject.fileType
	}

	betterPath.format = betterPath.fileType


	if (pathElement) {
		if (typeof pathElement === 'string') {
			betterPath.path(pathElement)
			return betterPath
		}
		else
			betterPath.pathObject(pathElement)
	}

	return betterPath
}
