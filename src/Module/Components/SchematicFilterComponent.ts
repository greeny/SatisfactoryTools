import {IComponentOptions} from 'angular';
import {SchematicFilterController} from '@src/Module/Components/SchematicFilterController';

export class SchematicFilterComponent implements IComponentOptions
{

	public template: string = require('@templates/Components/schematicFilters.html');
	public controller = SchematicFilterController;
	public controllerAs = 'ctrl';
	public transclude = true;

}
