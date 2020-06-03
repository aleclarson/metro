/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

require('metro-require');

const convertConfig = require('./convertConfig');
const getDefaultConfig = require('./defaults');

const {loadConfig, resolveConfig, mergeConfig} = require('./loadConfig');

module.exports = {
  loadConfig,
  resolveConfig,
  mergeConfig,
  getDefaultConfig,
  convert: convertConfig,
};
