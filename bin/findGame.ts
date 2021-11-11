import * as fs from 'fs';
import * as minimist from 'minimist';
import { exit } from 'process';
import { Channel, GameFinder, IGameFinderOptions, isChannel } from './gameFinder';

export class GameFinderOptions implements IGameFinderOptions {
	/** Satisfactory update channel */
	channel: Channel;

	/** true to only look for the game in Steam paths */
	onlySteam: boolean;

	/** true to only look for the game in Epic Games paths */
	onlyEpic: boolean;

	/** if defined, do not use the Windows registry to find the Steam library paths, just use this value */
	steamLibraryPath?: string;

	/** if defined, do not use the Windows registry to find the Epic Games 'Manifests' directory, just use this value */
	epicManifestsPath?: string;

	errors?: string[];

	help: boolean;

	printUsage = () => {
		const print = this.errors ? console.error : console.log;
		if (this.errors) print(this.errors.join('\n'));

		if (process.platform === 'win32') {
			print(`
Usage:
findGame -c CHANNEL [OPTIONS]

Parameters:
-c CHANNEL,--channel CHANNEL
Update channel for Satisfactory. Must be experimental or earlyaccess.

Options:
-s,--only-steam
Only look for Steam installation.

-e,--only-epic
Only look for Epic Games installation.

-l PATH,--steam-library-path PATH
The full path to the Steam library containing the game.
By default, this path is determined automatically using the Windows Registry.

-m PATH,--epic-manifests-path PATH
The full path to the Epic Games Manifests directory containing the *.item files for each installed game.
By default, this path is determined automatically using the Windows Registry.
`);
		}
		else {
			print(`
Usage: yarn findGame PARAMETERS

One or more parameters must be passed (more than one is okay).

Parameters:
-c CHANNEL,--channel CHANNEL
Update channel for Satisfactory. Must be experimental or earlyaccess.
If not specified, the default value is experimental.

-l PATH,--steam-library-path PATH
The full path to the Steam library containing the game.

-m PATH,--epic-manifests-path PATH
The full path to the Epic Games Manifests directory containing the *.item files for each installed game.

Examples:
(assuming you've mounted your Windows C: drive to /mnt/windows, and that's where things are installed...)

Find a Steam installation:
yarn findGame --steam-library-path /mnt/windows/Program Files \\(x86\\)/Steam/steamapps

Find an Epic Games installation:
yarn findGame --epic-manifests-path /mnt/windows/ProgramData/Epic/EpicGamesLauncher/Data/Manifests`);
		}
	};

	validate(): void {
		const errors = this.errors ?? [];
		if (this.onlyEpic && this.onlySteam) {
			errors.push('Syntax error: --only-steam and --only-epic are mutually exclusive');
		}

		if (this.onlyEpic && this.steamLibraryPath) {
			errors.push('Syntax error: --only-epic and --steam-library-path are mutually exclusive');
		}

		if (this.onlySteam && this.epicManifestsPath) {
			errors.push('Syntax error: --only-steam and --epic-manifests-path are mutually exclusive');
		}

		if (process.platform === 'linux') {
			// linux options validation
			if (!this.epicManifestsPath && !this.steamLibraryPath) {
				errors.push('Syntax error: You must specify --steam-library-path PATH and/or --epic-manifests-path PATH')
			}
			this.onlyEpic = !!this.epicManifestsPath && this.steamLibraryPath === undefined;
			this.onlySteam = !!this.steamLibraryPath && this.epicManifestsPath === undefined;
		}
		// windows options validation
		const anyPathSpecified = !!this.epicManifestsPath && !!this.steamLibraryPath;
		if (anyPathSpecified && this.channel) {
			errors.push('Syntax error: Cannot specify channel if an override path is provided.');
		}
		if (!isChannel(this.channel)) {
			errors.push('Syntax error: invalid channel.');
		}

		if (!!this.epicManifestsPath && !fs.existsSync(this.epicManifestsPath)) {
			errors.push(`Syntax error: ${this.epicManifestsPath} is not a valid path.`);
		}
		if (!!this.steamLibraryPath && !fs.existsSync(this.steamLibraryPath)) {
			errors.push(`Syntax error: ${this.steamLibraryPath} is not a valid path.`);
		}

		if (errors.length) {
			this.errors = this.errors ? [...this.errors, ...errors] : errors;
		}
	}

	static parseCommandLineArguments() {
		const options = new GameFinderOptions();
		const errors: string[] = [];
		const minimistOptions: minimist.Opts = {
			alias: { c: 'channel', s: 'only-steam', e: 'only-epic', l: "steam-library-path", m: 'epic-manifests-path', '?': 'help' },
			boolean: ['help'],
			string: ['channel', "steam-library-path", "epic-manifests-path"],
			default: {
				channel: 'experimental'
			},
			unknown: (arg: string) => { errors.push(`Unrecognized argument: ${arg}`); return false; },
		};

		if (process.platform === 'linux') {
			minimistOptions.string = ['channel', 'steam', 'epic'];
		}

		const argv = minimist.default(process.argv.slice(2), minimistOptions);

		options.channel = argv.channel.toLowerCase();
		options.onlyEpic = argv.e === true;
		options.onlySteam = argv.s === true;
		options.epicManifestsPath = argv.m;
		options.steamLibraryPath = argv.l;
		options.help = argv.help;

		if (errors.length) options.errors = errors;

		return options;
	}
}


const options = GameFinderOptions.parseCommandLineArguments();

if (options.help) {
	options.printUsage();
	exit(0);
}
options.validate();

if (options.errors) {
	options.printUsage();
	exit(1);
}

const gamePath = GameFinder.findGame(options);
console.log(gamePath);