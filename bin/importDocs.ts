import * as fs from 'fs';
import * as path from 'path';
import { GameFinderOptions } from './findGame';
import { GameFinder } from './gameFinder';

const installPath = GameFinder.findGame(GameFinderOptions.parseCommandLineArguments());

if (!installPath) {
	throw new Error('Could not find a local installation of Satisfactory Experimental!');
}

const docsPath = path.join(installPath, 'CommunityResources', 'Docs', 'Docs.json');

if (!fs.existsSync(docsPath)) {
	throw new Error(`${docsPath} does not exist`);
}

const dataPath = path.normalize(path.join(__dirname, '..', 'data'));
fs.copyFileSync(docsPath, path.join(dataPath, 'Docs.json'));
