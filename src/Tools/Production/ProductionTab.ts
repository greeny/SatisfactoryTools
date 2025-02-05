import angular, {ITimeoutService} from 'angular';
import {Constants} from '@src/Constants';
import data, {Data} from '@src/Data/Data';
import {IProductionControllerScope} from '@src/Module/Controllers/ProductionController';
import axios from 'axios';
import {Strings} from '@src/Utils/Strings';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {Callbacks} from '@src/Utils/Callbacks';
import {IProductionData, IProductionDataApiRequest, IProductionDataRequestCompleted, IProductionDataRequestInput, IProductionDataRequestItem} from '@src/Tools/Production/IProductionData';
import {ResultStatus} from '@src/Tools/Production/ResultStatus';
import {Solver} from '@src/Solver/Solver';
import {ProductionResult} from '@src/Tools/Production/Result/ProductionResult';
import {ProductionResultFactory} from '@src/Tools/Production/Result/ProductionResultFactory';
import {DataProvider} from '@src/Data/DataProvider';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import { GraphSettings } from './Result/Graph';

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

	public graphSettings: GraphSettings = {
		applyCompleted: true,
		showCompleted: true,
		showHighlightDependents: true,
		showHighlightLimits: true,
	};

	public tab: string = 'production';
	public resultTab: string = 'visualization';
	public shareLink: string = '';
	public resultStatus: ResultStatus = ResultStatus.NO_INPUT;
	public resultNew: ProductionResult|undefined;
	public easter: boolean = false;
	public data: IProductionData;

	private readonly unregisterCallback: () => void;
	private firstRun: boolean = true;

	public constructor(private readonly scope: IProductionControllerScope, private readonly version: string, productionData?: IProductionData)
	{
		if (productionData) {
			this.data = productionData;
		} else {
			this.resetData();
			this.addEmptyProduct();
		}

		if (typeof this.data.request.blockedMachines === 'undefined') {
			this.data.request.blockedMachines = [];
		}

		this.unregisterCallback = scope.$watch(() => {
			return this.data.request;
		}, Callbacks.debounce((newValue, oldValue) => {
			this.firstRun = false;
			this.scope.saveState();
			this.shareLink = '';
			this.calculate(this.scope.$timeout);
		}, 400), true);
	}

	public calculate($timeout?: ITimeoutService): void
	{
		let request = false;
		this.easter = false;
		for (const item of this.data.request.production) {
			if (item.item === 'Desc_ColorCartridge_C' && item.amount === 69420) {
				this.easter = true;
			}
		}

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
			const apiRequest: IProductionDataApiRequest = angular.copy(this.data.request) as IProductionDataApiRequest;
			switch (this.version) {
				case '0.8':
					apiRequest.gameVersion = '0.8.0';
					break;
				case '1.0-ficsmas':
					apiRequest.gameVersion = '1.0.0-ficsmas';
					break;
				default:
					apiRequest.gameVersion = '1.0.0';
			}

			const blockedMachines = apiRequest.blockedMachines || [];
			const allowedAlts: string[] = [];
			for (const recipeClass of apiRequest.allowedAlternateRecipes) {
				const recipe = data.getRecipeByClassName(recipeClass);
				if (recipe) {
					let allowed = true;
					for (const machineClass of blockedMachines) {
						if (recipe.producedIn.indexOf(machineClass) !== -1) {
							allowed = false;
						}
					}
					if (allowed) {
						allowedAlts.push(recipeClass);
					}
				}
			}
			apiRequest.allowedAlternateRecipes = allowedAlts;

			const blockedRecipes: string[] = [];
			for (const recipe of data.getBaseItemRecipes()) {
				let allowed = apiRequest.blockedRecipes.indexOf(recipe.className) === -1;
				for (const machineClass of blockedMachines) {
					if (recipe.producedIn.indexOf(machineClass) !== -1) {
						allowed = false;
					}
				}
				if (!allowed) {
					blockedRecipes.push(recipe.className);
				}
			}
			apiRequest.blockedRecipes = blockedRecipes;

			const completed = apiRequest.completed;

			delete apiRequest.blockedMachines;
			delete apiRequest.completed;

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

					apiRequest.completed = completed;

					const factory = new ProductionResultFactory;
					this.resultNew = factory.create(this.graphSettings, apiRequest, result, DataProvider.get());
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
				blockedMachines: [],
				blockedResources: [],
				sinkableResources: [],
				production: [],
				input: [],
				completed: [],
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
		if (this.easter) {
			Strings.copyToClipboard('https://easter.ficsit.app/OptvkwO668wweaMB', 'You\'ve successfully crafted a blueprint for the broken assembly line! You may now proceed to the link that has been copied (just paste it in your browser). You can also copy this link: https://easter.ficsit.app/OptvkwO668wweaMB', 20000);
			return;
		}

		if (this.shareLink) {
			Strings.copyToClipboard(this.shareLink, 'Link for sharing has been copied to clipboard.');
			return;
		}
		const shareData = angular.copy(this.data);
		shareData.metadata.name = this.name;
		shareData.metadata.icon = this.icon;
		axios({
			method: 'POST',
			url: 'https://api.satisfactorytools.com/v2/share/?version=' + this.version,
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

	public addEmptyCompleted(): void
	{
		this.addCompletedItem({
			recipe: null,
			amount: 10,
		});
	}

	public addCompletedItem(item: IProductionDataRequestCompleted): void
	{
		this.data.request.completed = this.data.request.completed || [];
		this.data.request.completed.push(item);
	}

	public cloneCompleted(item: IProductionDataRequestCompleted): void
	{
		this.data.request.completed = this.data.request.completed || [];
		this.data.request.completed.push({
			recipe: item.recipe,
			amount: item.amount,
		});
	}

	public clearCompleted(): void
	{
		this.data.request.completed = [];
		this.addEmptyCompleted();
	}

	public removeCompleted(item: IProductionDataRequestCompleted): void
	{
		this.data.request.completed = this.data.request.completed || [];
		const index = this.data.request.completed.indexOf(item);
		if (index in this.data.request.completed) {
			this.data.request.completed.splice(index, 1);
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

	public isMachineEnabled(className: string): boolean
	{
		if (typeof this.data.request.blockedMachines === 'undefined') {
			return false;
		}
		return this.data.request.blockedMachines.indexOf(className) === -1;
	}

	public toggleMachine(className: string): void
	{
		if (typeof this.data.request.blockedMachines === 'undefined') {
			return;
		}
		const index = this.data.request.blockedMachines.indexOf(className);
		if (index === -1) {
			this.data.request.blockedMachines.push(className);
		} else {
			this.data.request.blockedMachines.splice(index, 1);
		}
	}

	public toggleApplyCompleted(): void {
		this.graphSettings.applyCompleted = !this.graphSettings.applyCompleted;
	}

	public toggleShowCompleted(): void {
		this.graphSettings.showCompleted = !this.graphSettings.showCompleted;
	}

	public toggleHighlightDependents(): void {
		this.graphSettings.showHighlightDependents = !this.graphSettings.showHighlightDependents;
	}

	public toggleHighlightLimits(): void {
		this.graphSettings.showHighlightLimits = !this.graphSettings.showHighlightLimits;
	}

	public recipeMachineDisabled(recipe: IRecipeSchema): boolean
	{
		if (typeof this.data.request.blockedMachines === 'undefined') {
			return false;
		}
		for (const madeIn of recipe.producedIn) {
			if (this.data.request.blockedMachines.indexOf(madeIn) !== -1) {
				return true;
			}
		}
		return false;
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
