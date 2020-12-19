import {ProductionTool} from '@src/Tools/Production/ProductionTool';
import angular from 'angular';
import {IProductionToolRequest, IProductionToolRequestInput, IProductionToolRequestItem} from '@src/Tools/Production/IProductionToolRequest';
import {Constants} from '@src/Constants';
import data, {Data} from '@src/Data/Data';
import {IProductionControllerScope} from '@src/Module/Controllers/ProductionController';
import axios from 'axios';
import {Strings} from '@src/Utils/Strings';
import {ProductionRequestSchemaConverter} from '@src/Tools/Production/ProductionRequestSchemaConverter';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {Callbacks} from '@src/Utils/Callbacks';

export class ProductionTab
{

	public tool: ProductionTool;

	public state = {
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
	};

	public tab: string = 'production';
	public resultTab: string = 'visualization';
	public shareLink: string = '';

	private readonly unregisterCallback: () => void;
	private firstRun: boolean = true;

	public constructor(private readonly scope: IProductionControllerScope, productionToolRequest?: IProductionToolRequest)
	{
		this.tool = new ProductionTool;

		if (productionToolRequest) {
			productionToolRequest = ProductionRequestSchemaConverter.convert(productionToolRequest);
			this.tool.productionRequest = productionToolRequest;
		} else {
			this.addEmptyProduct();
		}

		const ignoredKeys = ['name', 'icon'];

		this.unregisterCallback = scope.$watch(() => {
			return this.tool.productionRequest;
		}, Callbacks.debounce((newValue, oldValue) => {
			const changes: string[] = [];
			for (const key in newValue) {
				if (newValue.hasOwnProperty(key)) {
					if (ignoredKeys.indexOf(key) === -1 && !angular.equals(newValue[key], oldValue[key])) {
						changes.push(key);
					}
				}
			}
			if (changes.length || this.firstRun) {
				this.firstRun = false;
				this.scope.saveState();
				this.shareLink = '';
				this.tool.calculate(this.scope.$timeout);
			}
		}, 300), true);
	}

	public sinkableResourcesOrderCallback = (item: IItemSchema) => {
		return this.state.sinkableResourcesSortBy === 'name' ? item.name : item.sinkPoints;
	}

	public copyShareLink(): void
	{
		if (this.shareLink) {
			Strings.copyToClipboard(this.shareLink, 'Link for sharing has been copied to clipboard.');
			return;
		}
		const shareData = angular.copy(this.tool.productionRequest);
		shareData.name = this.tool.name;
		shareData.icon = this.tool.icon;
		axios({
			method: 'POST',
			url: 'https://api.satisfactorytools.com/v1/share',
			data: shareData,
		}).then((response) => {
			this.scope.$timeout(0).then(() => {
				this.shareLink = response.data.link;
				Strings.copyToClipboard(response.data.link, 'Link for sharing has been copied to clipboard.');
			});
		}).catch(() => {
			this.scope.$timeout(0).then(() => {
				this.shareLink = '';
				alert('Couldn\'t get the share link.');
			});
		});
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

	public addEmptyInput(): void
	{
		this.addInput({
			item: null,
			amount: 10,
		});
	}

	public addInput(item: IProductionToolRequestInput): void
	{
		this.tool.productionRequest.input.push(item);
	}

	public cloneInput(item: IProductionToolRequestInput): void
	{
		this.tool.productionRequest.input.push({
			item: item.item,
			amount: item.amount,
		});
	}

	public clearInput(): void
	{
		this.tool.productionRequest.input = [];
		this.addEmptyInput();
	}

	public removeInput(item: IProductionToolRequestInput): void
	{
		const index = this.tool.productionRequest.input.indexOf(item);
		if (index in this.tool.productionRequest.input) {
			this.tool.productionRequest.input.splice(index, 1);
		}
	}

	public setSinkableResourcesSort(sort: string)
	{
		if (this.state.sinkableResourcesSortBy === sort) {
			this.state.sinkableResourcesSortReverse = !this.state.sinkableResourcesSortReverse;
		} else {
			this.state.sinkableResourcesSortBy = sort;
			this.state.sinkableResourcesSortReverse = false;
		}
	}

	public toggleSinkableResource(className: string): void
	{
		const index = this.tool.productionRequest.sinkableResources.indexOf(className);
		if (index === -1) {
			this.tool.productionRequest.sinkableResources.push(className);
		} else {
			this.tool.productionRequest.sinkableResources.splice(index, 1);
		}
	}

	public isSinkableResourceEnabled(className: string): boolean
	{
		return this.tool.productionRequest.sinkableResources.indexOf(className) !== -1;
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

	public setAllSinkableResources(value: boolean): void
	{
		if (value) {
			this.tool.productionRequest.sinkableResources = data.getSinkableItems().map((item) => {
				return item.className;
			});
		} else {
			this.tool.productionRequest.sinkableResources = [];
		}
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
