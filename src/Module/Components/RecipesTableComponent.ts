import {IComponentOptions} from 'angular';
import {RecipesTableController} from '@src/Module/Components/RecipesTableController';

export class RecipesTableComponent implements IComponentOptions
{

	public template: string = require('@templates/Components/recipesTable.html');
	public controller = RecipesTableController;
	public controllerAs = 'ctrl';
	public transclude = true;
	public bindings = {
		recipes: '=',
	};

}
