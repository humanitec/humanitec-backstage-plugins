#!/usr/bin/env node

const { execSync } = require('child_process');
const { join: pathJoin } = require('path');

const publishedPackagesJSON = process.argv[2];

// The format is [{"name": "@xx/xx", "version": "1.2.0"}, {"name": "@xx/xy", "version": "0.8.9"}]
// https://github.com/changesets/action/tree/v1/?tab=readme-ov-file#outputs

if (!publishedPackagesJSON) {
  console.error('Please provide the list of published packages');
  process.exit(1);
}

const publishedPackages = JSON.parse(publishedPackagesJSON);

for (const package of publishedPackages) {
  package.name += '-dynamic'
  console.log(`Publishing package: ${package.name}@${package.version}`);

  const archiveName = `${package.name.replace('@humanitec/backstage', 'humanitec-backstage')}-${package.version}.tgz`
  const archive  = pathJoin(__dirname, 'output', archiveName);

  execSync(`npm publish ${archive} --access public`, { stdio: 'inherit' });
}
