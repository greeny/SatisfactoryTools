import {IProductionTab} from "@modules/Calculator/Model/IProductionTab";
import {IProductionToolRequest} from "@tools/Production/IProductionToolRequest";
import {ProductionToolRequestFactory} from "@modules/Calculator/Service/ProductionToolRequestFactory";

export class ProductionTabFactory {
	public static create(productionToolRequest: IProductionToolRequest = null): IProductionTab {
		if (null === productionToolRequest) {
			productionToolRequest = ProductionToolRequestFactory.create();
		}

		return {
			expanded: true,
			renaming: false,
			sinkableResourcesExpanded: true,
			alternateRecipesExpanded: true,
			basicRecipesExpanded: true,
			sinkableResourcesSortBy: 'name',
			sinkableResourcesSortReverse: false,
			sinkableResourcesQuery: '',
			alternateRecipesQuery: '',
			basicRecipesQuery: '',
			resultLoading: false,
			productionToolRequest: productionToolRequest,
			activeTab: 'production'
		};
	}
}
