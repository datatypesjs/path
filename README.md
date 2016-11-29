# Path

How node's path module should have been implemented.

First of all this module uses a saner definition for the
sections of the path-string.

```txt
┌───────────────────────────────────────────────────────────────────┐
│                            path                                   │
├──────────────────────────────────────┬────────────────────────────┤
│             directoryPath            │      fileName              │
├──────────────────┬───────────────────┼────────────────┬───────────┤
│         *        │                   │    baseName    │ extension │
├──────┐           │   directoryName   ├──────────┬─────┴───────────┤
│ root │           │                   │ fileRoot │   extensions    │
├──────┴───────────┴───────────────────┴──────────┴─────────────────┤
│  /     home/user /       dir         /   file   . tar .   gz      │
└───────────────────────────────────────────────────────────────────┘

(* grandParentDirectory - only used internally)
```

Addtional attributes: `fileType`, `isDotfile`, `isAbsolute`

The complete path object looks like this:

```yaml
path: /home/user/dir/file.tar.gz
root: /
directoryPath: /home/user/dir
directoryName: dir
fileName: file.tar.gz
baseName: file.tar
extension: gz
fileRoot: file
extensions: [tar, gz]
# File type is the normalized and lowercased extension (e.g. YML => yaml)
fileType: gz
isDotfile: false
isAbsolute: true
```

Internally `root`, `grandParentDirectory`, `directoryName`, `fileRoot`,
`extensions` and `extension` are handled as the source properties.
This means all the other properties are derived from this source properties.


## Installation

```sh
npm install --save @datatypes/path
```

## Usage

```js
import Path from '@datatypes/path'

const pathA = Path.fromString('/home/user/dir/file-a.tar.gz')
const pathB = new Path({
  directoryPath: '/home/user/dir',
  fileName: 'file-b.tar.gz',
})

console.info(`
  File extension of file A: ${pathA.extension}
  Base name of file B: ${pathB.baseName}
`)
```
