#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load, dump } from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BASE = join(ROOT, 'openapi-base.yaml');
const OUT = join(ROOT, 'openapi.yaml');
const CONTROLLERS = join(ROOT, 'src', 'controllers');

// 1. Read base spec
let spec;
try {
  spec = load(readFileSync(BASE, 'utf8'));
} catch (err) {
  console.error(`Failed to read base spec: ${err.message}`);
  process.exit(1);
}

// 2. Find all openapi.yaml fragments under src/controllers/
function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, acc);
    } else if (entry.name === 'openapi.yaml') {
      acc.push(full);
    }
  }
  return acc;
}

const fragments = walk(CONTROLLERS);
console.log(`Found ${fragments.length} OpenAPI fragments`);

// 3. Merge each fragment's top-level keys into base spec
for (const file of fragments) {
  let fragment;
  try {
    fragment = load(readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(`Failed to parse ${file}: ${err.message}`);
    process.exit(1);
  }

  for (const [pathKey, methods] of Object.entries(fragment)) {
    if (!spec.paths[pathKey]) {
      spec.paths[pathKey] = {};
    }
    Object.assign(spec.paths[pathKey], methods);
  }
  console.log(`  ${file}`);
}

// 4. Write output
writeFileSync(OUT, dump(spec, { indent: 2, lineWidth: 120, noRefs: false, sortKeys: false }));
console.log(`\nWrote ${OUT} (${Object.keys(spec.paths).length} paths)`);
