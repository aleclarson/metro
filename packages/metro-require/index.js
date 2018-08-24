const Module = require('module');
const path = require('path');
const fs = require('fs');

const loadModule = Module._load;
Module._load = handleMetroPaths;

const buildDir = '/build/';
const srcPattern = /^([^\/]+)\/src\/(.+)$/;

const packagesDir = path.resolve(__dirname, '..') + '/';
const packageNames = fs.readdirSync(packagesDir);

const cache = {};

// Paths to Metro modules are rewritten to the build directory.
function handleMetroPaths(request, parent, isMain) {
  let filename = cache[request];
  if (filename) {
    return loadModule(filename, parent, isMain);
  }
  if (request[0] !== '/') {
    const sep = request.indexOf('/');
    const pkg = sep == -1 ? request : request.slice(0, sep);
    if (packageNames.indexOf(pkg) !== -1) {
      request = packagesDir + request;
    }
  }
  filename = Module._resolveFilename(request, parent, isMain);
  if (filename.startsWith(packagesDir)) {
    const match = filename.slice(packagesDir.length).match(srcPattern);
    if (match) {
      filename = packagesDir + match[1] + buildDir + match[2];
      cache[arguments[0]] = filename;
    }
  }
  return loadModule(filename, parent, isMain);
}
