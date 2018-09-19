/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Routine } from '@boost/core';
import chalk from 'chalk';
import fs from 'fs-extra';
import DriverContext from './contexts/DriverContext';

export default class CleanupRoutine extends Routine<DriverContext> {
  async execute(): Promise<boolean[]> {
    this.task('Deleting config files', this.deleteConfigFiles).skip(
      !this.tool.config.config.cleanup,
    );

    return this.serializeTasks();
  }

  /**
   * Delete all temporary config files.
   */
  async deleteConfigFiles(context: DriverContext): Promise<boolean[]> {
    return Promise.all(
      context.configPaths.map(configPath => {
        this.debug('Deleting config file %s', chalk.cyan(configPath));

        this.tool.emit(`delete-config-file`, [configPath]);

        return fs.remove(configPath).then(() => true);
      }),
    );
  }
}
