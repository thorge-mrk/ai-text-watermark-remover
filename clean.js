#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { removeWatermarks } = require('../src/remover.js');

function printUsage() {
  console.error('Usage: clean.js [--file <path>] [--no-invisibles] [--no-typical]');
  process.exit(1);
}

function main() {
  let file = null;
  let removeInvisible = true;
  let replaceTypical = true;
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--file':
        file = args[++i];
        break;
      case '--no-invisibles':
        removeInvisible = false;
        break;
      case '--no-typical':
        replaceTypical = false;
        break;
      case '--help':
      case '-h':
        printUsage();
        break;
      default:
        console.error(`Unknown argument: ${arg}`);
        printUsage();
    }
  }
  const input = file ? fs.readFileSync(path.resolve(file), 'utf8') : fs.readFileSync(0, 'utf8');
  const output = removeWatermarks(input, { removeInvisible, replaceTypical });
  process.stdout.write(output);
}

if (require.main === module) {
  main();
}