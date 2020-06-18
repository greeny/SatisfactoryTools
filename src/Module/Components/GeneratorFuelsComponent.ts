import {IComponentOptions} from 'angular';
import {GeneratorFuelsComponentController} from '@src/Module/Components/GeneratorFuelsComponentController';

export class GeneratorFuelsComponent implements IComponentOptions
{

	public template: string = require('@templates/Components/generatorFuels.html');
	public controller = GeneratorFuelsComponentController;
	public controllerAs = 'ctrl';
	public bindings = {
		building: '=',
	};

}
