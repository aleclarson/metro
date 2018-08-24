const Module = require('module');
const path = require('path');

const buildDir = '/build/';
const srcPattern = /^([^\/]+)\/src\/(.+)$/;

const packagesDir = path.resolve(__dirname, '..') + '/';

const cache = {};

const resolve = Module._resolveFilename;
Module._resolveFilename = (request, parent, isMain) =>
  cache[request] || rewriteMetroPath(request, parent, isMain);

// Paths to Metro modules are rewritten to the build directory.
function rewriteMetroPath(request, parent, isMain) {
  const filename = resolve(request, parent, isMain);
  if (filename.startsWith(packagesDir)) {
    const match = filename.slice(packagesDir.length).match(srcPattern);
    if (match) {
      return cache[request] = packagesDir + match[1] + buildDir + match[2];
    }
  }
  return filename;
}
