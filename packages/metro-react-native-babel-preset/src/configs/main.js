/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

'use strict';

function isTypeScriptSource(fileName) {
  return !!fileName && fileName.endsWith('.ts');
}

function isTSXSource(fileName) {
  return !!fileName && fileName.endsWith('.tsx');
}

const defaultPlugins = [
  // the flow strip types plugin must go BEFORE class properties!
  // there'll be a test case that fails if you don't.
  [require('@babel/plugin-transform-flow-strip-types')],
  [
    require('@babel/plugin-proposal-class-properties'),
    // use `this.foo = bar` instead of `this.defineProperty('foo', ...)`
    {loose: true},
  ],
  [require('@babel/plugin-transform-function-name')],
  [require('@babel/plugin-transform-react-jsx')],
];

const es2015ImportExport = [
  require('@babel/plugin-transform-modules-commonjs'),
  {
    strict: false,
    strictMode: false, // prevent "use strict" injections
    allowTopLevelThis: true, // dont rewrite global `this` -> `undefined`
  },
];

const logicalAssignmentOperators = [require('@babel/plugin-proposal-logical-assignment-operators')];
const nullishCoalescingOperator = [
  require('@babel/plugin-proposal-nullish-coalescing-operator'),
  {loose: true},
];
const optionalChaining = [
  require('@babel/plugin-proposal-optional-chaining'),
  {loose: true},
];
const reactDisplayName = [
  require('@babel/plugin-transform-react-display-name'),
];
const reactJsxSource = [require('@babel/plugin-transform-react-jsx-source')];
const symbolMember = [require('../transforms/transform-symbol-member')];

const babelRuntime = [
  require('@babel/plugin-transform-runtime'),
  {
    helpers: true,
  },
];

const getPreset = (src, options) => {
  const isNull = src == null;
  const hasForOf =
    isNull || (src.indexOf('for') !== -1 && src.indexOf('of') !== -1);

  const extraPlugins = [];

  if (!options || !options.disableImportExportTransform) {
    extraPlugins.push(es2015ImportExport);
  }

  if (hasForOf || src.indexOf('Symbol') !== -1) {
    extraPlugins.push(symbolMember);
  }
  if (
    isNull ||
    src.indexOf('React.createClass') !== -1 ||
    src.indexOf('createReactClass') !== -1
  ) {
    extraPlugins.push(reactDisplayName);
  }
  if (isNull || src.indexOf('?.') !== -1) {
    extraPlugins.push(optionalChaining);
  }
  if (isNull || src.indexOf('??') !== -1) {
    extraPlugins.push(nullishCoalescingOperator);
  }
  if (
    isNull ||
    src.indexOf('||=') !== -1 ||
    src.indexOf('&&=') !== -1
  ) {
    extraPlugins.push(logicalAssignmentOperators);
  }

  if (options && options.dev) {
    extraPlugins.push(reactJsxSource);
  }

  if (!options || !options.disableBabelRuntime) {
    extraPlugins.push(babelRuntime);
  }

  return {
    comments: false,
    compact: true,
    overrides: [
      {
        plugins: defaultPlugins,
      },
      {
        test: isTypeScriptSource,
        plugins: [
          [require('@babel/plugin-transform-typescript'), {isTSX: false}],
        ],
      },
      {
        test: isTSXSource,
        plugins: [
          [require('@babel/plugin-transform-typescript'), {isTSX: true}],
        ],
      },
      {
        plugins: extraPlugins,
      },
    ],
  };
};

module.exports = options => {
  if (options.withDevTools == null) {
    const env = process.env.BABEL_ENV || process.env.NODE_ENV;
    if (!env || env === 'development') {
      return getPreset(null, {...options, dev: true});
    }
  }
  return getPreset(null, options);
};

module.exports.getPreset = getPreset;
