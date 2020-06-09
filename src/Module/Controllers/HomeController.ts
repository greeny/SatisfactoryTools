import data from '@src/Data/Data';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {RecentlyVisitedItemsService} from '@src/Module/Services/RecentlyVisitedItemsService';
import {ItemFiltersService} from '@src/Module/Services/ItemFiltersService';

export class HomeController
{
	public static $inject = ['RecentlyVisitedItemsService', 'ItemFiltersService'];

	public constructor(public recentlyVisited: RecentlyVisitedItemsService, private filtersService: ItemFiltersService)
	{
	}

	public getItemByClassName(className: string): IItemSchema|null
	{
		return data.getItemByClassName(className);
	}

	public getFilteredItems(): IItemSchema[]
	{
		return this.filtersService.filterItems();
	}
}
