#!/usr/bin/env node
/**
 * post-build-exports: Auto-generate package.json exports from built files.
 *
 * Usage: post-build-exports [options]
 *
 * Options:
 *   --dist <path>       Path to dist directory (default: "dist")
 *   --preserve <paths>  Comma-separated export paths to preserve (e.g., "./tailwind.css")
 *   --prefix <path>     Prefix for export paths (default: "./")
 *   --strip <path>      Path prefix to strip from export names (default: none)
 *
 * This script:
 * 1. Scans the dist directory for .js files
 * 2. Generates explicit exports in package.json
 * 3. Preserves any exports listed in --preserve
 *
 * Example:
 *   post-build-exports --dist dist --preserve "./tailwind.css"
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

interface ExportEntry {
  import?: string;
  types?: string;
  default?: string;
}

type ExportsMap = Record<string, ExportEntry | string>;

interface PackageJson {
  exports?: ExportsMap;
  [key: string]: unknown;
}

function parseArgs(args: string[]): {
  dist: string;
  preserve: string[];
  prefix: string;
  strip: string;
} {
  const result = {
    dist: 'dist',
    prefix: './',
    preserve: [] as string[],
    strip: '',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    if (arg === '--dist' && next) {
      result.dist = next;
      i++;
    } else if (arg === '--preserve' && next) {
      result.preserve = next.split(',').map((p) => p.trim());
      i++;
    } else if (arg === '--prefix' && next) {
      result.prefix = next;
      i++;
    } else if (arg === '--strip' && next) {
      result.strip = next;
      i++;
    }
  }

  return result;
}

function findJsFiles(dir: string, baseDir: string): string[] {
  const files: string[] = [];

  if (!existsSync(dir)) {
    return files;
  }

  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findJsFiles(fullPath, baseDir));
    } else if (entry.endsWith('.js') && !entry.endsWith('.test.js')) {
      files.push(relative(baseDir, fullPath));
    }
  }

  return files;
}

function generateExportName(jsPath: string, strip: string): string {
  let exportPath = jsPath.replace(/\.js$/, '');

  if (strip && exportPath.startsWith(strip)) {
    exportPath = exportPath.slice(strip.length);
    if (exportPath.startsWith('/')) {
      exportPath = exportPath.slice(1);
    }
  }

  return `./${exportPath}`;
}

function generateExports(jsFiles: string[], distDir: string, strip: string): ExportsMap {
  const exports: ExportsMap = {};

  for (const jsFile of jsFiles.sort()) {
    const exportName = generateExportName(jsFile, strip);
    const dtsFile = jsFile.replace(/\.js$/, '.d.ts');
    const dtsPath = join(process.cwd(), distDir, dtsFile.replace(/^dist\//, ''));

    const entry: ExportEntry = {
      import: `./${distDir}/${jsFile}`.replace(/\/+/g, '/'),
    };

    if (existsSync(dtsPath) || existsSync(join(process.cwd(), distDir, dtsFile))) {
      entry.types = `./${distDir}/${dtsFile}`.replace(/\/+/g, '/');
    }

    exports[exportName] = entry;
  }

  return exports;
}

function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  const packageJsonPath = join(process.cwd(), 'package.json');
  if (!existsSync(packageJsonPath)) {
    console.error('No package.json found in current directory');
    process.exit(1);
  }

  const distPath = join(process.cwd(), options.dist);
  if (!existsSync(distPath)) {
    console.error(`Dist directory not found: ${options.dist}`);
    console.error('Run build first before generating exports.');
    process.exit(1);
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as PackageJson;
  const existingExports = packageJson.exports || {};

  const preservedExports: ExportsMap = {};
  for (const preservePath of options.preserve) {
    const existing = existingExports[preservePath];
    if (existing !== undefined) {
      preservedExports[preservePath] = existing;
    }
  }

  const jsFiles = findJsFiles(distPath, distPath);
  const generatedExports = generateExports(jsFiles, options.dist, options.strip);

  const newExports: ExportsMap = {
    ...preservedExports,
    ...generatedExports,
  };

  const sortedExports: ExportsMap = {};
  for (const key of Object.keys(newExports).sort()) {
    const value = newExports[key];
    if (value !== undefined) {
      sortedExports[key] = value;
    }
  }

  packageJson.exports = sortedExports;

  writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

  console.log(`✅ Generated ${Object.keys(generatedExports).length} exports in package.json`);
  if (options.preserve.length > 0) {
    console.log(`   Preserved ${Object.keys(preservedExports).length} existing exports`);
  }
}

main();
