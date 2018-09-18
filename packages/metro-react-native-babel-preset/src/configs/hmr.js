/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
'use strict';

var hmrPlugin = {
  plugins: [
    [
      require('metro-babel7-plugin-react-transform'),
      {
        transforms: [
          {
            transform: 'react-transform-hmr/lib/index.js',
            imports: ['react'],
            locals: ['module'],
          },
        ],
      },
    ],
  ],
};

module.exports = function() {
  return hmrPlugin;
};
