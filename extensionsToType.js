const extNormalizeMap = {
  'aif': 'aiff',
  'gzip': 'gz',
  'htm': 'html',
  'jpg': 'jpeg',
  'tgz': 'tar.gz',
  'tif': 'tiff',
  'xht': 'xhtml',
  'yml': 'yaml',
}

module.exports = (extensions) => {
  if (Array.isArray(extensions)) {
    extensions = extensions.join('.')
  }
  if (extensions === '') return null
  const extLower = extensions.toLowerCase()
  return extNormalizeMap[extLower] || extLower
}
