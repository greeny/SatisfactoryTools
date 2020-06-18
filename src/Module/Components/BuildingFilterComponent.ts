import {IComponentOptions} from 'angular';
import {BuildingFilterController} from '@src/Module/Components/BuildingFilterController';

export class BuildingFilterComponent implements IComponentOptions
{

	public template: string = require('@templates/Components/buildingFilters.html');
	public controller = BuildingFilterController;
	public controllerAs = 'ctrl';
	public transclude = true;

}
