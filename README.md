# Path

How node's path module should have been implemented.

First of all this module uses a saner definition for the
sections of the path-string.

```txt
┌───────────────────────────────────────────────────────────────────┐
│                            path                                   │
├──────────────────────────────────────┬────────────────────────────┤
│             directoryPath            │      fileName              │
├──────┬───────────┬───────────────────┼──────────┬─────────────────┤
│      │           │                   │          │   extensions    │
│ root │           │   directoryName   │ baseName ├─────┬───────────┤
│      │           │                   │          │     │ extension │
├──────┴───────────┴───────────────────┴──────────┴─────┴───────────┤
│  /     home/user /       dir         /   file   . tar .   gz      │
└───────────────────────────────────────────────────────────────────┘
```

Addtional attributes: `fileType`, `isDotfile`, `isAbsolute`

The complete path object looks like this:

```yaml
path: /home/user/dir/file.tar.gz
root: /
directoryPath: /home/user/dir
directoryName: dir
fileName: file.tar.gz
baseName: file
extensions: [tar, gz]
extension: gz
# File type is the normalized and lowercased extension (e.g. jPeg => jpg)
fileType: gz
isDotfile: false
isAbsolute: true
```

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
