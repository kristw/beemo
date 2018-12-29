/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable camelcase */

export type UISetting = 'bdd' | 'tdd' | 'qunit' | 'exports';

export interface ReporterOptions {
  [key: string]: any;
}

export interface MochaConfig {
  allow_uncaught?: boolean;
  async_only?: boolean;
  bail?: boolean;
  check_leaks?: boolean;
  colors?: boolean;
  compilers?: string | string[];
  debug?: boolean;
  debug_brk?: boolean;
  delay?: boolean;
  es_staging?: boolean;
  exit?: boolean;
  expose_gc?: boolean;
  fgrep?: string;
  file?: string | string[];
  forbid_only?: boolean;
  forbid_pending?: boolean;
  full_trace?: boolean;
  globals?: string | string[];
  grep?: string;
  growl?: boolean;
  icu_data_dir?: boolean;
  inline_diffs?: boolean;
  inspect?: boolean;
  inspect_brk?: boolean;
  interfaces?: boolean;
  invert?: boolean;
  log_timer_events?: boolean;
  napi_modules?: boolean;
  no_colors?: boolean;
  no_deprecation?: boolean;
  no_exit?: boolean;
  no_timeouts?: boolean;
  no_warnings?: boolean;
  opts?: string;
  perf_basic_prof?: boolean;
  preserve_symlinks?: boolean;
  prof?: boolean;
  recursive?: boolean;
  reporter?: string;
  reporter_options?: ReporterOptions;
  reporters?: boolean;
  retries?: number;
  require?: string | string[];
  slow?: number;
  sort?: boolean;
  timeout?: number;
  throw_deprecation?: boolean;
  trace?: boolean;
  trace_deprecation?: boolean;
  trace_warnings?: boolean;
  ui?: string;
  use_strict?: boolean;
  watch?: boolean;
  watch_extensions?: string[];
  // Harmony flags
  [option: string]: any;
}

export interface MochaArgs {
  A?: boolean;
  allowUncaught?: boolean;
  asyncOnly?: boolean;
  b?: boolean;
  bail?: boolean;
  c?: boolean;
  C?: boolean;
  checkLeaks?: boolean;
  colors?: boolean;
  compilers?: string | string[];
  d?: boolean;
  debug?: boolean;
  debugBrk?: boolean;
  delay?: boolean;
  deprecation?: boolean;
  diff?: boolean;
  esStaging?: boolean;
  exclude?: string;
  exit?: boolean;
  exposeGc?: boolean;
  f?: string;
  fgrep?: string;
  file?: string;
  forbidOnly?: boolean;
  forbidPending?: boolean;
  fullTrace?: boolean;
  G?: boolean;
  g?: string;
  gc?: boolean;
  globals?: string;
  grep?: string;
  growl?: boolean;
  h?: boolean;
  help?: boolean;
  i?: boolean;
  icuDataDir?: boolean;
  inlineDiffs?: boolean;
  inspect?: boolean;
  inspectBrk?: boolean;
  interfaces?: boolean;
  invert?: boolean;
  logTimerEvents?: boolean;
  napiModules?: boolean;
  O?: string;
  opts?: string;
  perfBasicProf?: boolean;
  preserveSymlinks?: boolean;
  prof?: boolean;
  r?: string;
  R?: string;
  recursive?: boolean;
  reporter?: string;
  reporterOptions?: string | string[];
  reporters?: boolean;
  require?: string;
  retries?: number;
  S?: boolean;
  s?: number;
  slow?: number;
  sort?: boolean;
  t?: number;
  throwDeprecation?: boolean;
  timeout?: number;
  timeouts?: boolean;
  trace?: boolean;
  traceDeprecation?: boolean;
  traceWarnings?: boolean;
  u?: UISetting;
  ui?: UISetting;
  useStrict?: boolean;
  V?: boolean;
  version?: boolean;
  w?: boolean;
  warnings?: boolean;
  watch?: boolean;
  watchExtensions?: string | string[];
}
