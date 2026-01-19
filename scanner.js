const fg = require("fast-glob");
const path = require("path");

const DEFAULT_IGNORE = ["node_modules/**", ".git/**", "dist/**", "build/**"];

/**
 * Scans a directory and returns an array of objects with extension information
 * @param {string} dirPath - Path of the directory to scan (default: process.cwd())
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeHidden - Include hidden files (default: false)
 * @param {string[]} options.ignore - Patterns of files/folders to ignore (default: ['node_modules/**', '.git/**'])
 * @param {boolean} options.onlyExtensions - Return only an array of extension names (default: false)
 * @returns {Promise<Array<{extension: string, files: string[], totalFiles: number}>|Array<string>>} Array of objects sorted by extension or array of extension names
 */
async function scanExtensions(dirPath = process.cwd(), options = {}) {
  const {
    includeHidden = false,
    ignore = DEFAULT_IGNORE,
    onlyExtensions = false,
  } = options;

  try {
    //
    const files = await fg("**/*", {
      cwd: dirPath,
      dot: includeHidden,
      ignore: ignore,
      onlyFiles: true,
      absolute: false,
    });

    const extensionMap = new Map();

    files.forEach((file) => {
      const ext = path.extname(file);
      const extension = ext ? ext.slice(1) : "(no extension)";

      if (!extensionMap.has(extension)) {
        extensionMap.set(extension, []);
      }
      extensionMap.get(extension).push(file);
    });

    if (onlyExtensions) {
      return Array.from(extensionMap.keys()).sort();
    }

    const result = Array.from(extensionMap.entries())
      .map(([extension, filesList]) => ({
        extension,
        files: filesList,
        totalFiles: filesList.length,
      }))
      .sort((a, b) => a.extension.localeCompare(b.extension));

    return result;
  } catch (error) {
    throw new Error(`Error scanning directory: ${error.message}`);
  }
}

module.exports = {
  scanExtensions,
};
