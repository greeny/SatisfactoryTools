import {IComponentOptions} from 'angular';
import {GeneratorDetailsComponentController} from '@src/Module/Components/GeneratorDetailsComponentController';

export class GeneratorDetailsComponent implements IComponentOptions
{

	public template: string = require('@templates/Components/generatorDetails.html');
	public controller = GeneratorDetailsComponentController;
	public controllerAs = 'ctrl';
	public bindings = {
		building: '=',
	};

}
