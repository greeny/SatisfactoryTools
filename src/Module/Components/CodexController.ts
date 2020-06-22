import {RecentlyVisitedItemsService} from '@src/Module/Services/RecentlyVisitedItemsService';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {IFilterService} from '@src/Types/IFilterService';
import {Strings} from '@src/Utils/Strings';

export class CodexController
{

	public filtersService: IFilterService<any>;
	public entityPreviewState: string;
	public static $inject = ['RecentlyVisitedItemsService'];

	public constructor(public recentlyVisited: RecentlyVisitedItemsService)
	{
	}

	public getSchematicType(type: string): string
	{
		return Strings.convertSchematicType(type);
	}

	public getFilteredItems(): IItemSchema[]
	{
		return this.filtersService.filterEntities();
	}

}
