/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import path from 'path';
import { engine } from 'hygen';
import Logger from 'hygen/lib/logger';
import { Routine } from '@boost/core';
import ScaffoldContext from './contexts/ScaffoldContext';
import { BeemoTool } from './types';

export default class ScaffoldRoutine extends Routine<ScaffoldContext, BeemoTool> {
  bootstrap() {
    this.task(this.tool.msg('app:scaffoldRunGenerator'), this.runGenerator);
  }

  execute(context: ScaffoldContext) {
    return this.serializeTasks(context.moduleRoot);
  }

  /**
   * Handle shell executions from hygen.
   */
  handleExec = (action: string, input: string) =>
    this.executeCommand(action, [], {
      input,
      shell: true,
    });

  /**
   * Pipe a message from hygen to boost.
   */
  handleLog = (message: string) => {
    if (message && message.trim()) {
      this.tool.log(message);
    }
  };

  /**
   * Temporary solution until boost supports prompts.
   */
  handlePrompt = /* istanbul ignore next */ () => Promise.resolve({ overwrite: true });

  /**
   * Execute the hygen scaffolding generator.
   */
  async runGenerator(context: ScaffoldContext, moduleRoot: string) {
    const { tool } = this;
    const args = [context.generator, context.action];

    try {
      return await engine(context.argv, {
        createPrompter: /* istanbul ignore next */ () => ({ prompt: this.handlePrompt }),
        cwd: tool.options.root,
        debug: tool.config.debug,
        exec: this.handleExec,
        logger: new Logger(this.handleLog),
        templates: path.join(moduleRoot, 'templates'),
      });
    } catch (error) {
      // Intercept hygen error to provide a better error message
      if (error.message.startsWith("I can't find action")) {
        throw new Error(this.tool.msg('errors:scaffoldNoTemplates', { path: args.join('/') }));
      }

      throw error;
    }
  }
}
