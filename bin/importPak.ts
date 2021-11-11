import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { GameFinderOptions } from './findGame';
import { GameFinder } from './gameFinder';

const findPath = (name: string): string | undefined => {
	const paths = process.env.PATH?.split(';') ?? [];
	for (const dir of paths) {
		const fullPath = path.join(dir, name);
		if (fs.existsSync(fullPath)) {
			return fullPath;
		}
	}
	return undefined;
};

// As of Update 5, 4.22 no longer works. Updated to the latest version that did work.
const UNREAL_ENGINE_VERSION = 'ue4.27';

const installPath = GameFinder.findGame(GameFinderOptions.parseCommandLineArguments());

const umodelPath = findPath('umodel_64.exe');

if (!installPath) {
	throw new Error('Could not find a local installation of Satisfactory Experimental!');
}

if (!umodelPath) {
	throw new Error('Could not find umodel_64.exe in your PATH. Download it from https://www.gildor.org/en/projects/umodel#files and add the directory where you extracted it to your path!');
}

console.log(`Exporting game icons from ${installPath}`);

const pakDir = path.join(installPath, 'FactoryGame', 'Content', 'Paks');
if (!fs.existsSync(pakDir)) {
	throw new Error(`'${pakDir}' does not exist`);
}

const iconDir = path.normalize(path.join(__dirname, '..', 'data', 'icons', 'out256'));
if (!fs.existsSync(iconDir)) {
	fs.mkdirSync(iconDir, { recursive: true });
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

const commands = variants
	.map(x => `umodel_64.exe -path="${pakDir}" -out="${iconDir}" -png -export ${x} -game=${UNREAL_ENGINE_VERSION}`);

for (const command of commands) {
	console.log(`Exporting assets from game: ${command}`);
	try {
		execSync(command);
	}
	catch { }
}
