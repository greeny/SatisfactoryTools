import {RecentlyVisitedItemsService} from '@src/Module/Services/RecentlyVisitedItemsService';
import {IItemSchema} from '@src/Schema/IItemSchema';
import data from '@src/Data/Data';
import {IFilterService} from '@src/Types/IFilterService';

export class CodexController
{

	public filtersService: IFilterService<any>;
	public entityPreviewState: string;
	public static $inject = ['RecentlyVisitedItemsService'];

	public constructor(public recentlyVisited: RecentlyVisitedItemsService)
	{
	}

	public getItemByClassName(className: string): IItemSchema|null
	{
		return data.getItemByClassName(className);
	}

	public getFilteredItems(): IItemSchema[]
	{
		return this.filtersService.filterEntities();
	}

}
