/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import path from 'path';
import { ModuleLoader, Routine, AggregatedResponse, WorkspacePackageConfig } from '@boost/core';
import Script from './Script';
import ScriptContext from './contexts/ScriptContext';
import RunScriptRoutine from './execute/RunScriptRoutine';
import isPatternMatch from './utils/isPatternMatch';
import { BeemoTool } from './types';

export default class ExecuteScriptRoutine extends Routine<ScriptContext, BeemoTool> {
  workspacePackages: WorkspacePackageConfig[] = [];

  bootstrap() {
    const { argv, args, eventName, workspaceRoot, workspaces } = this.context;
    const command = argv.join(' ');

    if (args.workspaces) {
      if (!workspaces || workspaces.length === 0) {
        throw new Error(
          this.tool.msg('errors:driverWorkspacesNotEnabled', { arg: args.workspaces }),
        );
      }

      this.workspacePackages = this.tool.loadWorkspacePackages({ root: workspaceRoot });

      this.getFilteredWorkspacePackages().forEach(pkg => {
        this.pipe(
          new RunScriptRoutine(pkg.workspace.packageName, command, {
            packageRoot: pkg.workspace.packagePath,
          }),
        );
      });
    } else {
      this.pipe(new RunScriptRoutine(eventName, command));
    }
  }

  execute(context: ScriptContext): Promise<AggregatedResponse> {
    const concurrency = context.args.concurrency || this.tool.config.execute.concurrency;

    this.task(this.tool.msg('app:scriptLoad'), this.loadScript);

    return this.serializeTasks().then(script => this.poolRoutines(script, { concurrency }));
  }

  /**
   * Return a list of workspaces optionally filtered.
   */
  getFilteredWorkspacePackages(): WorkspacePackageConfig[] {
    return this.workspacePackages.filter(pkg =>
      // @ts-ignore Contains not typed yet
      isPatternMatch(pkg.name, this.context.args.workspaces, { contains: true }),
    );
  }

  /**
   * Attempt to load a script from the configuration module.
   */
  async loadScript(context: ScriptContext): Promise<Script> {
    const filePath = path.join(context.moduleRoot, 'scripts', `${context.scriptName}.js`);
    const loader = new ModuleLoader(this.tool, 'script', Script);

    this.debug('Loading script');

    const script = loader.importModule(filePath, [
      context.eventName, // Use kebab form
      this.tool.msg('app:scriptRunNamed', { name: context.scriptName }),
    ]);

    this.tool.emit(`${context.eventName}.load-script`, [context, script]);

    return script;
  }
}
