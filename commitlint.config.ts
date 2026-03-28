/**
 * https://commitlint.js.org/reference/rules-configuration.html
 * https://commitlint.js.org/reference/rules.html
 */

import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
};

export default Configuration;
