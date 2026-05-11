const extNormalizeMap: Record<string, string> = {
  'aif': 'aiff',
  'gzip': 'gz',
  'htm': 'html',
  'jpg': 'jpeg',
  'tgz': 'tar.gz',
  'tif': 'tiff',
  'xht': 'xhtml',
  'yml': 'yaml',
}

export default function extensionsToType (
  extensions: string | string[]
): string | null {
  const joined = Array.isArray(extensions) ? extensions.join('.') : extensions
  if (joined === '') return null
  const extLower = joined.toLowerCase()
  return extNormalizeMap[extLower] || extLower
}
