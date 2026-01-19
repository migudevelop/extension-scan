#!/usr/bin/env node

const { Command } = require("commander");
const { scanExtensions } = require("./scanner");
const path = require("path");

const program = new Command();

program
  .name("extension-scan")
  .description("Scan a directory and list found file extensions")
  .version("1.0.0")
  .argument("[path]", "Directory path to scan", process.cwd())
  .option("-i, --ignore <patterns...>", "File/folder patterns to ignore", [
    "node_modules/**",
    ".git/**",
    "dist/**",
    "build/**",
  ])
  .option("-d, --dot", "Include hidden files", false)
  .option("-v, --verbose", "Show file list per extension", false)
  .option("-o, --only-extensions", "Return only extension names", false)
  .action(async (dirPath, { ignore, dot, verbose, onlyExtensions }) => {
    try {
      // Resolve absolute path
      const absolutePath = path.resolve(dirPath);

      console.log(`\nScanning directory: ${absolutePath}\n`);

      // Scan extensions
      const results = await scanExtensions(absolutePath, {
        includeHidden: dot,
        ignore: ignore,
        onlyExtensions: onlyExtensions,
      });

      if (!results || results.length === 0) {
        console.log("No files found.");
        return;
      }

      // If only extension names requested
      if (onlyExtensions) {
        console.log("Extensions found:\n");
        results.forEach((ext) => {
          console.log(`  - ${ext}`);
        });
        console.log(`\nTotal: ${results.length} extension(s)\n`);
        return;
      }

      console.log("Extensions found:\n");
      console.log("─".repeat(60));

      results.forEach(({ extension, files, totalFiles }) => {
        console.log(`\n📁 ${extension}`);
        console.log(`   Total: ${totalFiles} file(s)`);

        if (verbose) {
          console.log("   Files:");
          files.forEach((file) => {
            console.log(`     - ${file}`);
          });
        }
      });

      console.log("\n" + "─".repeat(60));
      console.log(`\nTotal extensions: ${results.length}`);
      console.log(
        `Total files: ${results.reduce((sum, r) => sum + r.totalFiles, 0)}\n`,
      );
    } catch (error) {
      console.error(`\n❌ Error: ${error.message}\n`);
      process.exit(1);
    }
  });

program.parse();
