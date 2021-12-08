import angular, {ITimeoutService} from 'angular';
import {Constants} from '@src/Constants';
import rawData from '@data/data.json';
import data, {Data} from '@src/Data/Data';
import {IProductionControllerScope} from '@src/Module/Controllers/ProductionController';
import axios from 'axios';
import {Strings} from '@src/Utils/Strings';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {Callbacks} from '@src/Utils/Callbacks';
import {IProductionData, IProductionDataApiRequest, IProductionDataRequestInput, IProductionDataRequestItem} from '@src/Tools/Production/IProductionData';
import {ResultStatus} from '@src/Tools/Production/ResultStatus';
import {Solver} from '@src/Solver/Solver';
import {IJsonSchema} from '@src/Schema/IJsonSchema';
import {ProductionResult} from '@src/Tools/Production/Result/ProductionResult';
import {ProductionResultFactory} from '@src/Tools/Production/Result/ProductionResultFactory';

export class ProductionTab
{

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
		buildingsExpanded: {},
		powerExpanded: {},
		itemsExpanded: {},
		overviewCollapsed: {},
	};

	public tab: string = 'production';
	public resultTab: string = 'visualization';
	public shareLink: string = '';
	public resultStatus: ResultStatus = ResultStatus.NO_INPUT;
	public resultNew: ProductionResult|undefined;
	public data: IProductionData;

	private readonly unregisterCallback: () => void;
	private firstRun: boolean = true;

	public constructor(private readonly scope: IProductionControllerScope, productionData?: IProductionData)
	{
		if (productionData) {
			this.data = productionData;
		} else {
			this.resetData();
			this.addEmptyProduct();
		}

		this.unregisterCallback = scope.$watch(() => {
			return this.data.request;
		}, Callbacks.debounce((newValue, oldValue) => {
			this.firstRun = false;
			this.scope.saveState();
			this.shareLink = '';
			this.calculate(this.scope.$timeout);
		}, 300), true);
	}

	public calculate($timeout?: ITimeoutService): void
	{
		let request = false;

		for (const product of this.data.request.production) {
			if (product.item && product.amount > 0) {
				request = true;
				break;
			}
		}

		if (!request) {
			this.resultStatus = ResultStatus.NO_INPUT;
			return;
		}

		this.resultStatus = ResultStatus.CALCULATING;

		const calc = () => {
			const apiRequest: IProductionDataApiRequest = this.data.request as IProductionDataApiRequest;
			apiRequest.gameVersion = '0.5.0';
			Solver.solveProduction(apiRequest, (result) => {
				const res = () => {
					let length = 0;

					for (const k in result) {
						if (!result.hasOwnProperty(k)) {
							continue;
						}

						length++;
					}

					if (!length) {
						this.resultNew = undefined;
						this.resultStatus = ResultStatus.NO_RESULT;
						return;
					}

					const factory = new ProductionResultFactory;
					this.resultNew = factory.create(apiRequest, result, rawData as any as IJsonSchema);
					this.resultStatus = ResultStatus.RESULT;
				};

				if ($timeout) {
					$timeout(0).then(res);
				} else {
					res();
				}
			});

		};

		if ($timeout) {
			$timeout(0).then(calc);
		} else {
			calc();
		}
	}

	public resetData(): void
	{
		this.data = {
			metadata: {
				name: null,
				icon: null,
				schemaVersion: 1,
				gameVersion: '0',
			},
			request: {
				allowedAlternateRecipes: [],
				blockedRecipes: [],
				blockedResources: [],
				sinkableResources: [],
				production: [],
				input: [],
				resourceMax: angular.copy(Data.resourceAmounts),
				resourceWeight: angular.copy(Data.resourceWeights),
			},
		};
	}

	get icon(): string|null
	{
		if (this.data.metadata.icon) {
			return this.data.metadata.icon;
		}
		const items = this.data.request.production.filter((item) => {
			return !!item.item;
		});
		return items.length ? items[0].item : null;
	}

	get name(): string
	{
		if (this.data.metadata.name) {
			return this.data.metadata.name;
		}
		const items = this.data.request.production.filter((item) => {
			return !!item.item;
		});
		return items.length ? (data.getItemByClassName(items[0].item || '')?.name + ' Factory') : 'Unnamed Factory';
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
		const shareData = angular.copy(this.data);
		shareData.metadata.name = this.name;
		shareData.metadata.icon = this.icon;
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

	public addProduct(item: IProductionDataRequestItem): void
	{
		this.data.request.production.push(item);
	}

	public cloneProduct(item: IProductionDataRequestItem): void
	{
		this.data.request.production.push({
			item: item.item,
			type: item.type,
			amount: item.amount,
			ratio: item.ratio,
		});
	}

	public clearProducts(): void
	{
		this.data.request.production = [];
		this.addEmptyProduct();
	}

	public removeProduct(item: IProductionDataRequestItem): void
	{
		const index = this.data.request.production.indexOf(item);
		if (index in this.data.request.production) {
			this.data.request.production.splice(index, 1);
		}
	}

	public addEmptyInput(): void
	{
		this.addInput({
			item: null,
			amount: 10,
		});
	}

	public addInput(item: IProductionDataRequestInput): void
	{
		this.data.request.input.push(item);
	}

	public cloneInput(item: IProductionDataRequestInput): void
	{
		this.data.request.input.push({
			item: item.item,
			amount: item.amount,
		});
	}

	public clearInput(): void
	{
		this.data.request.input = [];
		this.addEmptyInput();
	}

	public removeInput(item: IProductionDataRequestInput): void
	{
		const index = this.data.request.input.indexOf(item);
		if (index in this.data.request.input) {
			this.data.request.input.splice(index, 1);
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
		const index = this.data.request.sinkableResources.indexOf(className);
		if (index === -1) {
			this.data.request.sinkableResources.push(className);
		} else {
			this.data.request.sinkableResources.splice(index, 1);
		}
	}

	public isSinkableResourceEnabled(className: string): boolean
	{
		return this.data.request.sinkableResources.indexOf(className) !== -1;
	}

	public toggleAlternateRecipe(className: string): void
	{
		const index = this.data.request.allowedAlternateRecipes.indexOf(className);
		if (index === -1) {
			this.data.request.allowedAlternateRecipes.push(className);
		} else {
			this.data.request.allowedAlternateRecipes.splice(index, 1);
		}
	}

	public isAlternateRecipeEnabled(className: string): boolean
	{
		return this.data.request.allowedAlternateRecipes.indexOf(className) !== -1;
	}

	public toggleBasicRecipe(className: string): void
	{
		const index = this.data.request.blockedRecipes.indexOf(className);
		if (index === -1) {
			this.data.request.blockedRecipes.push(className);
		} else {
			this.data.request.blockedRecipes.splice(index, 1);
		}
	}

	public isResourceEnabled(className: string): boolean
	{
		return this.data.request.blockedResources.indexOf(className) === -1;
	}

	public toggleResource(className: string): void
	{
		const index = this.data.request.blockedResources.indexOf(className);
		if (index === -1) {
			this.data.request.blockedResources.push(className);
		} else {
			this.data.request.blockedResources.splice(index, 1);
		}
	}

	public isBasicRecipeEnabled(className: string): boolean
	{
		return this.data.request.blockedRecipes.indexOf(className) === -1;
	}

	public convertAlternateRecipeName(name: string): string
	{
		return name.replace('Alternate: ', '');
	}

	public setAllSinkableResources(value: boolean): void
	{
		if (value) {
			this.data.request.sinkableResources = data.getSinkableItems().map((item) => {
				return item.className;
			});
		} else {
			this.data.request.sinkableResources = [];
		}
	}

	public setAllBasicRecipes(value: boolean): void
	{
		if (value) {
			this.data.request.blockedRecipes = [];
		} else {
			this.data.request.blockedRecipes = data.getBaseItemRecipes().map((recipe) => {
				return recipe.className;
			});
		}
	}

	public setAllAlternateRecipes(value: boolean): void
	{
		if (value) {
			this.data.request.allowedAlternateRecipes = data.getAlternateRecipes().map((recipe) => {
				return recipe.className;
			});
		} else {
			this.data.request.allowedAlternateRecipes = [];
		}
	}

	public setDefaultRawResources(): void
	{
		this.data.request.resourceMax = angular.copy(Data.resourceAmounts);
	}

	public zeroRawResources(): void
	{
		for (const key in this.data.request.resourceMax) {
			this.data.request.resourceMax[key] = 0;
		}
	}

	public getIconSet(): string[]
	{
		const productionArray = this.data.request.production.filter((product) => {
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
