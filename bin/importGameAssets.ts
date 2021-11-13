import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { exit } from "process";
import { GameFinder } from "./import/game-finder";
import { GameFinderOptions } from "./import/game-finder-options";
import { InstallPathOptions } from "./import/install-path-options";
import { YarnCommandOptions } from './import/yarn-command-options';
import { parseDocs } from './parseDocs/docParser';

const usageCommand = 'yarn importGameAssets';

const validateOptions = (options: YarnCommandOptions) => {
	if (options.hasErrors) {
		options.printErrors();
		options.printUsage();
		exit(1);
	}
	else if (options.help) {
		options.printUsage();
		exit(0);
	}
};

const getUModelPath = () => {
	let umodelPath: string = path.join(__dirname, 'umodel', process.platform);
	if (process.platform === 'linux') {
		umodelPath = path.normalize(path.join(umodelPath, 'umodel'));
	}
	else{
		umodelPath = path.normalize(path.join(umodelPath, 'umodel_64.exe'));
	}
	return umodelPath;
};

const importPaks = (pakDir: string, targetDir: string): void => {
	// As of Update 5, 4.22 no longer works. Updated to the latest version that did work.
	const UNREAL_ENGINE_VERSION = 'ue4.27';

	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir, { recursive: true });
	}

	let variants = ['512', '256', '128', '64']
		.map(d => [`*_${d}.uasset`, `*_${d}_New.uasset`, `*_${d}_new.uasset`])
		.reduce((arr, cur) => {
			for (const n of cur) {
				arr.push(n);
			}
			return arr;
		}, []) as string[];


	// add variants that we don't need to permute
	variants = [...variants, '*Icon*.uasset'];

	const umodelPath = getUModelPath();
	const commands = variants
		.map(x => `${umodelPath} -path="${pakDir}" -out="${targetDir}" -png -export ${x} -game=${UNREAL_ENGINE_VERSION}`);

	console.log(`Exporting PAK content from ${pakDir} using ${umodelPath}`);

	for (const command of commands) {
		console.log(command);
		try {
			execSync(command);
		}
		catch (err) {
			console.warn(`${command} failed with ${err}`);
		}
	}
};

let installPath: string | undefined;
if (process.platform === 'linux') {
	const options = new InstallPathOptions(usageCommand);
	validateOptions(options);
	installPath = options.path;
}
else {
	const options = new GameFinderOptions(usageCommand);
	validateOptions(options);
	installPath = GameFinder.findGame(options);
	console.log(installPath);
}

const dataDir = path.normalize(path.join(__dirname, '..', 'data'));

if (installPath === undefined) throw new Error("Unexpected error");

const sourceDocsPath = path.join(installPath, 'CommunityResources', 'Docs', 'Docs.json');
const targetDocsPath = path.join(dataDir, 'Docs.json');

fs.copyFileSync(sourceDocsPath, targetDocsPath);
parseDocs(targetDocsPath, dataDir);

const pakDir = path.join(installPath, 'FactoryGame', 'Content', 'Paks');
const iconPath = path.join(dataDir, 'icons', 'out256');

importPaks(pakDir, iconPath);
