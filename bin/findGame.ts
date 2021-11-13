import { exit } from 'process';
import { GameFinder } from './import/game-finder';
import { GameFinderOptions } from './import/game-finder-options';

const options = new GameFinderOptions('yarn findGame');
if (options.hasErrors) {
	options.printErrors();
	options.printUsage();
	exit(1);
}
else if (options.help){
	options.printUsage();
	exit(0);
}

const gamePath = GameFinder.findGame(options);
console.log(gamePath);