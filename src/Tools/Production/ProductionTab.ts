import {ProductionTool} from '@src/Tools/Production/ProductionTool';
import angular from 'angular';
import {IProductionToolRequest, IProductionToolRequestItem} from '@src/Tools/Production/IProductionToolRequest';
import {Constants} from '@src/Constants';
import data, {Data} from '@src/Data/Data';
import {IProductionControllerScope} from '@src/Module/Controllers/ProductionController';

export class ProductionTab
{

	public tool: ProductionTool;

	public state = {
		expanded: true,
		renaming: false,
		alternateRecipesExpanded: true,
		basicRecipesExpanded: true,
		alternateRecipesQuery: '',
		basicRecipesQuery: '',
		resultLoading: false,
	};

	public tab: string = 'production';

	private readonly unregisterCallback: () => void;

	public constructor(private readonly scope: IProductionControllerScope, productionToolRequest?: IProductionToolRequest)
	{
		this.tool = new ProductionTool;

		if (productionToolRequest) {
			this.tool.productionRequest = productionToolRequest;
		} else {
			this.addEmptyProduct();
		}

		this.unregisterCallback = scope.$watch(() => {
			return this.tool.productionRequest;
		}, () => {
			this.tool.calculate(this.scope.$timeout);
		}, true);
	}

	public unregister(): void
	{
		this.unregisterCallback();
	}

	public addEmptyProduct(): void
	{
		this.addProduct({
			item: null,
			type: Constants.PRODUCTION_TYPE.PER_MINUTE,
			amount: 10,
			ratio: 100,
		});
	}

	public addProduct(item: IProductionToolRequestItem): void
	{
		this.tool.productionRequest.production.push(item);
	}

	public cloneProduct(item: IProductionToolRequestItem): void
	{
		this.tool.productionRequest.production.push({
			item: item.item,
			type: item.type,
			amount: item.amount,
			ratio: item.ratio,
		});
	}

	public clearProducts(): void
	{
		this.tool.productionRequest.production = [];
		this.addEmptyProduct();
	}

	public removeProduct(item: IProductionToolRequestItem): void
	{
		const index = this.tool.productionRequest.production.indexOf(item);
		if (index in this.tool.productionRequest.production) {
			this.tool.productionRequest.production.splice(index, 1);
		}
	}

	public toggleAlternateRecipe(className: string): void
	{
		const index = this.tool.productionRequest.allowedAlternateRecipes.indexOf(className);
		if (index === -1) {
			this.tool.productionRequest.allowedAlternateRecipes.push(className);
		} else {
			this.tool.productionRequest.allowedAlternateRecipes.splice(index, 1);
		}
	}

	public isAlternateRecipeEnabled(className: string): boolean
	{
		return this.tool.productionRequest.allowedAlternateRecipes.indexOf(className) !== -1;
	}

	public toggleBasicRecipe(className: string): void
	{
		const index = this.tool.productionRequest.blockedRecipes.indexOf(className);
		if (index === -1) {
			this.tool.productionRequest.blockedRecipes.push(className);
		} else {
			this.tool.productionRequest.blockedRecipes.splice(index, 1);
		}
	}

	public isResourceEnabled(className: string): boolean
	{
		return this.tool.productionRequest.blockedResources.indexOf(className) === -1;
	}

	public toggleResource(className: string): void
	{
		const index = this.tool.productionRequest.blockedResources.indexOf(className);
		if (index === -1) {
			this.tool.productionRequest.blockedResources.push(className);
		} else {
			this.tool.productionRequest.blockedResources.splice(index, 1);
		}
	}

	public isBasicRecipeEnabled(className: string): boolean
	{
		return this.tool.productionRequest.blockedRecipes.indexOf(className) === -1;
	}

	public convertAlternateRecipeName(name: string): string
	{
		return name.replace('Alternate: ', '');
	}

	public setAllBasicRecipes(value: boolean): void
	{
		if (value) {
			this.tool.productionRequest.blockedRecipes = [];
		} else {
			this.tool.productionRequest.blockedRecipes = data.getBaseItemRecipes().map((recipe) => {
				return recipe.className;
			});
		}
	}

	public setAllAlternateRecipes(value: boolean): void
	{
		if (value) {
			this.tool.productionRequest.allowedAlternateRecipes = data.getAlternateRecipes().map((recipe) => {
				return recipe.className;
			});
		} else {
			this.tool.productionRequest.allowedAlternateRecipes = [];
		}
	}

	public setDefaultRawResources(): void
	{
		this.tool.productionRequest.resourceMax = angular.copy(Data.resourceAmounts);
	}

	public zeroRawResources(): void
	{
		for (const key in this.tool.productionRequest.resourceMax) {
			this.tool.productionRequest.resourceMax[key] = 0;
		}
	}

	public getIconSet(): string[]
	{
		const productionArray = this.tool.productionRequest.production.filter((product) => {
			return !!product.item;
		}).map((product) => {
			return product.item + '';
		});
		let result = [...(Object.values(data.getAllItems())), ...(Object.values(data.getAllBuildings()))].map((entry) => {
			return entry.className;
		});
		result = [...productionArray, ...result].filter((value, index, self) => {
			return self.indexOf(value) === index;
		});
		return result;
	}
}
