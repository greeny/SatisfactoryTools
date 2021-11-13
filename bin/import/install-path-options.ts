import minimist from 'minimist';
import { FluentValidator } from './fluent-validator';
import { YarnCommandOptions } from './yarn-command-options';

export class InstallPathOptions implements YarnCommandOptions {
  private _help: boolean = false;
  private _path: string;
  private errors: string[] = [];

  constructor(public usageCommand: string) {
    const minimistOptions: minimist.Opts = {
      alias: { p: 'install-path', '?': 'help' },
      boolean: ['help'],
      string: ['install-path'],
      unknown: (_: string) => false,
    };

    const argv = minimist(process.argv.slice(2), minimistOptions);
    this._path = argv.p;
    this._help = argv.help;
    this.validate();
  }

  /** returns true if there are any errors */
  get hasErrors(): boolean {
    return this.errors.length > 0;
  }

  /** returns true if usage should be printed */
  get help(): boolean {
    return this._help;
  }

  get path(): string {
    return this._path;
  }

  printErrors(): void {
    if (this.errors.length) {
      console.error('Syntax errors:');
      console.error(this.errors.join('\n'));
    }
  }

  printUsage(): void {
    console.log(`Usage:
${this.usageCommand} (-p,--install-path) PATH

-p PATH,--install-path PATH
The directory path where Satisfactory is installed.`);
  }

  private validate(): void {
    const helpText = 'Specify the directory path where Satisfactory is installed.'
    const validator = new FluentValidator()
      .true('--install-path', () => !!this.path, `$1 is required. ${helpText}`)
      .directoryExists(this.path, `$1 does not exist. ${helpText}`);
    this.errors = [...this.errors, ...validator.errors];
  }
}