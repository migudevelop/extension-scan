# extension-scan

![npm version](https://img.shields.io/npm/v/extension-scan)
![license](https://img.shields.io/badge/license-MIT-green.svg)

Scan directories and report found file extensions — useful for quick inventorying and auditing of project files.

## Features

- Fast file discovery using `fast-glob`
- CLI entrypoint with common options (ignore patterns, include hidden files, verbose)
- Programmatic API via `scanExtensions` for embedding in scripts

## Quick Start

### Install

Install globally to use as a CLI:

```bash
npm install -g extension-scan
# or with pnpm
pnpm add -g extension-scan
```

or install locally in your project:

```bash
npm install extension-scan
# or with pnpm
pnpm add extension-scan
```

### CLI Usage

Run the scanner against the current directory:

```bash
extension-scan
```

Scan a specific folder, include hidden files and show filenames for each extension:

```bash
extension-scan ./src -d -v
```

Show only extension names (one per line):

```bash
extension-scan ./ -o
```

Options (short):

- `-i, --ignore <patterns...>` : File/folder patterns to ignore (defaults include `node_modules/**`, `.git/**`)
- `-d, --dot` : Include hidden files
- `-v, --verbose` : Print file list per extension
- `-o, --only-extensions` : Output only extension names

### Programmatic Usage

Import and call `scanExtensions` from `scanner.js`:

```javascript
const { scanExtensions } = require("./scanner");

(async () => {
  const results = await scanExtensions(process.cwd(), { includeHidden: false });
  console.log(results);
})();
```

The function returns either:

- An array of extension names when `onlyExtensions: true`
- An array of objects `{ extension, files, totalFiles }` otherwise

## Files of Interest

- [index.js](index.js) — package entry
- [bin.js](bin.js) — CLI wrapper using `commander`
- [scanner.js](scanner.js) — core scanning logic

## License

This project is published under the ISC license. See the `LICENSE` file for details.
