import minimist from "minimist";
import { FluentValidator } from "./fluent-validator";
import { YarnCommandOptions } from "./yarn-command-options";

export type Channel = 'experimental' | 'earlyaccess';
export const isChannel = (obj: any): obj is Channel => {
  return obj === 'experimental' || obj === 'earlyaccess';
};

export class GameFinderOptions implements YarnCommandOptions {
  private _usageCommand: string;
  private _help: boolean = false;
  private errors: string[] = [];

  /** Satisfactory update channel */
  channel: Channel;

  /** true to only look for the game in Steam paths */
  onlySteam: boolean;

  /** true to only look for the game in Epic Games paths */
  onlyEpic: boolean;

  constructor(usageCommand: string) {
    this._usageCommand = usageCommand;
    const minimistOptions: minimist.Opts = {
      alias: { c: 'channel', s: 'only-steam', e: 'only-epic', '?': 'help' },
      boolean: ['help'],
      string: ['channel'],
      default: {
        channel: 'experimental'
      },
      unknown: (arg: string) => { this.errors.push(`Unrecognized argument: ${arg}`); return false; },
    };

    const argv = minimist(process.argv.slice(2), minimistOptions);

    this.channel = argv.channel.toLowerCase();
    this.onlyEpic = argv.e === true;
    this.onlySteam = argv.s === true;
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

  /** when called by a script, allows printUsage to print the correct command */
  get usageCommand(): string {
    return this._usageCommand;
  }

  printErrors() {
    if (this.errors.length) {
      console.error('Syntax errors:');
      console.error(this.errors.join('\n'));
    }
  }

  printUsage() {
    console.log(`Usage:
${this.usageCommand} (-c,--channel) CHANNEL [OPTIONS]

-c CHANNEL,--channel CHANNEL
Update channel for Satisfactory. Must be experimental or earlyaccess.

Options:
-s,--only-steam
Only look for Steam installation.

-e,--only-epic
Only look for Epic Games installation.
`);
  }

  private validate(): void {
    const validator = new FluentValidator()
      .mutuallyExclusive([
        { name: '--only-epic', test: () => this.onlyEpic },
        { name: '--only-steam', test: () => this.onlySteam }
      ])
      .oneOf('--channel', this.channel, ['experimental', 'earlyaccess']);

    if (process.platform === 'linux') {
      validator.fail('Not supported on linux');
    }
  }
}
