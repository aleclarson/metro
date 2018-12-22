#!/usr/bin/env node
/* eslint-disable */
const AsyncTaskGroup = require('async-task-group')
const bocks = require('bocks')
const exec = require('@cush/exec')
const ansi = require('ansi-colors')
const path = require('path')
const fs = require('saxon/sync')

// Number of processed packages
let progress = 0

// Look for a "/packages/" directory in each ancestor.
function getPackageDir(file) {
  const roots = ['/', process.env.HOME]
  for (let dir = file, ret; dir = path.dirname(dir), ret = dir + '/packages/'; ) {
    if (fs.isDir(ret)) return ret
    if (roots.includes(dir)) return null
  }
}

// Directories containing other linked packages
const packages = function() {
  let dirs = (process.env.USING || '').split(',').filter(name => !!name)
  dirs.push(process.cwd())

  return dirs.map(dir => {
    dir = path.resolve(dir)

    let pkg = getPackageDir(dir + '/.')
    if (pkg) {
      return fs.list(pkg)
        .map(name => pkg + name)
        .filter(fs.isDir)
    }

    throw Error('Unknown package dir: ' + JSON.stringify(name))
  })
}()

const links = [].concat(...packages)
const linkNames = links.map(link => path.basename(link))

// Package queue
const queue = new AsyncTaskGroup(1, initPackage)
queue.concat(packages.pop())

function initPackage(pkg) {
  let metaPath = pkg + '/package.json'
  if (!fs.exists(metaPath)) return

  let metaStr = fs.read(metaPath)
  let meta = JSON.parse(metaStr)

  let deps = meta.dependencies
  let changed = !!deps && localize(deps, pkg)

  deps = meta.devDependencies
  if (deps) changed = localize(deps, pkg) || changed

  if (!changed) return

  // Preserve trailing whitespace.
  let space = /\s*$/.exec(metaStr)
  space = space ? space[0] : ''

  metaStr = JSON.stringify(meta, null, 2) + space
  fs.write(metaPath, metaStr)

  let counted = false
  let countRE = /total (\d+)/

  // Do a fresh install.
  fs.remove(pkg + '/yarn.lock')
  fs.remove(pkg + '/node_modules', true)

  console.log(pkg)
}

function localize(deps, pkg) {
  let changed = false
  for (let key in deps) {
    let i = linkNames.indexOf(key)
    if (i >= 0) {
      let oldValue = deps[key]
      let newValue = 'link:' + path.relative(pkg, links[i])
      if (newValue !== oldValue) {
        changed = true
        deps[key] = newValue
      }
    }
  }
  return changed
}
