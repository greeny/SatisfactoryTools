import data from '@src/Data/Data';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {RecentlyVisitedItemsService} from '@src/Module/Services/RecentlyVisitedItemsService';

export class HomeController
{

	public static $inject = ['RecentlyVisitedItemsService'];

	public items: IItemSchema[] = Object.values(data.getAllItems());
	public filter = '';

	public constructor(public recentlyVisited: RecentlyVisitedItemsService) {}

	public getFilteredItems(): IItemSchema[]
	{
		if (!this.filter) {
			return this.items;
		}

		return this.items.filter((item) => {
			return item.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1;
		});
	}

	public getItemByClassName(className: string): IItemSchema|null
	{
		return data.getItemByClassName(className);
	}

}
