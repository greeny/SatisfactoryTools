import {IProductionToolRequest} from "@tools/Production/IProductionToolRequest";

export interface IProductionTab {
	expanded: boolean;
	renaming: boolean;
	sinkableResourcesExpanded: boolean;
	alternateRecipesExpanded: boolean;
	basicRecipesExpanded: boolean;
	sinkableResourcesSortBy: string;
	sinkableResourcesSortReverse: boolean;
	sinkableResourcesQuery: string;
	alternateRecipesQuery: string;
	basicRecipesQuery: string;
	resultLoading: false;
	activeTab: 'production' | 'items' | 'recipes';
	productionToolRequest: IProductionToolRequest;
}
