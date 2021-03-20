import {IComponentOptions} from 'angular';
import {ItemFilterController} from '@src/Module/Components/ItemFilterController';

export class ItemFilterComponent implements IComponentOptions
{

	public template: string = require('@templates/Components/itemFilters.html');
	public controller = ItemFilterController;
	public controllerAs = 'ctrl';
	public transclude = true;

}
