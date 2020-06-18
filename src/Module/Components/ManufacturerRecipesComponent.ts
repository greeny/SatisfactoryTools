import {IComponentOptions} from 'angular';
import {ManufacturerRecipesComponentController} from '@src/Module/Components/ManufacturerRecipesComponentController';

export class ManufacturerRecipesComponent implements IComponentOptions
{

	public template: string = require('@templates/Components/manufacturerRecipes.html');
	public controller = ManufacturerRecipesComponentController;
	public controllerAs = 'ctrl';
	public bindings = {
		building: '=',
	};

}
