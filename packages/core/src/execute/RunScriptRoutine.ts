/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Routine } from '@boost/core';
import chalk from 'chalk';
import optimal, { string } from 'optimal';
import parseArgs from 'yargs-parser';
import Script from '../Script';
import ScriptContext from '../contexts/ScriptContext';
import { Execution, BeemoTool } from '../types';

export interface RunScriptOptions {
  packageRoot: string;
}

export default class RunScriptRoutine extends Routine<ScriptContext, BeemoTool, RunScriptOptions> {
  bootstrap() {
    this.options = optimal(
      this.options,
      {
        packageRoot: string().empty(),
      },
      {
        name: 'RunScriptRoutine',
      },
    );
  }

  /**
   * Clone and create a new context so we can customize the root per execution.
   * This allows us to easily support workspace packages with different paths.
   */
  async execute(oldContext: ScriptContext, script: Script): Promise<Execution> {
    const context = new ScriptContext(oldContext.args, oldContext.scriptName);

    context.setScript(script, oldContext.path);
    context.argv = oldContext.argv;
    context.root = this.options.packageRoot || oldContext.root;
    context.moduleRoot = oldContext.moduleRoot;
    context.workspaceRoot = oldContext.workspaceRoot;
    context.workspaces = oldContext.workspaces;

    this.setContext(context);
    this.pipe(script);

    // Execute the script as a sub-routine
    let result = null;

    this.debug('Executing script "%s" in %s', context.argv.join(' '), chalk.cyan(context.root));

    this.tool.emit(`${context.eventName}.before-execute`, [context, context.argv, script]);

    try {
      result = await this.serializeRoutines(parseArgs(context.argv, script.args()));

      this.tool.emit(`${context.eventName}.after-execute`, [context, result, script]);
    } catch (error) {
      this.tool.emit(`${context.eventName}.failed-execute`, [context, error, script]);

      throw error;
    }

    return result;
  }
}
