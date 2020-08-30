import {IProductionToolRequest} from '@src/Tools/Production/IProductionToolRequest';
import {Dictionary} from '@ngrx/entity';
import {IItemSchema} from '@src/Schema/IItemSchema';

export interface ICalculatorState
{
	productionTabs: IProductionToolRequest[];
	currentTab: IProductionToolRequest|null;
	currentTabIndex: number|null;
	items: Dictionary<IItemSchema>;
}
