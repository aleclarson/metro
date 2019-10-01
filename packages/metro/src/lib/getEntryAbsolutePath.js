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

const getAbsolutePath = require('./getAbsolutePath');
const path = require('path');
const fs = require('fs-extra');

import type {ConfigT} from 'metro-config/src/configTypes.flow';

function getEntryAbsolutePath(config: ConfigT, entryFile: string): string {
  const result = config.projectRoot
    ? path.resolve(config.projectRoot, entryFile)
    : getAbsolutePath(entryFile, config.watchFolders);

  if (!fs.existsSync(result)) {
    throw new Error(`Entry path does not exist: "${result}"`);
  }
  return result;
}

module.exports = getEntryAbsolutePath;
