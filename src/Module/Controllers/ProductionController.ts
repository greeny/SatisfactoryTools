import model from '@src/Data/Model';
import * as angular from 'angular';
import {ILocationService, IScope, ITimeoutService} from 'angular';
import {ProductionTab} from '@src/Tools/Production/ProductionTab';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {Constants} from '@src/Constants';
import data from '@src/Data/Data';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {IResourceSchema} from '@src/Schema/IResourceSchema';
import {DataStorageService} from '@src/Module/Services/DataStorageService';
import {IProductionToolRequest} from '@src/Tools/Production/IProductionToolRequest';
import axios from 'axios';

export class ProductionController
{

	public tab: ProductionTab|null = null;
	public tabs: ProductionTab[] = [];
	public addingInProgress: boolean;
	public cloningInProgress: boolean;
	public readonly rawResources: IResourceSchema[] = data.getResources();
	public readonly craftableItems: IItemSchema[] = model.getAutomatableItems();
	public readonly inputableItems: IItemSchema[] = model.getInputableItems();
	public readonly sinkableItems: IItemSchema[] = data.getSinkableItems();
	public readonly alternateRecipes: IRecipeSchema[] = data.getAlternateRecipes();
	public readonly basicRecipes: IRecipeSchema[] = data.getBaseItemRecipes();

	public result: string;

	public options: {} = {
		'items/min': Constants.PRODUCTION_TYPE.PER_MINUTE,
		'maximize': Constants.PRODUCTION_TYPE.MAXIMIZE,
	};

	public static $inject = ['$scope', '$timeout', 'DataStorageService', '$location'];

	public constructor(
		private readonly scope: IProductionControllerScope,
		private readonly $timeout: ITimeoutService,
		private readonly dataStorageService: DataStorageService,
		private readonly $location: ILocationService,
	)
	{
		scope.$timeout = $timeout;
		scope.saveState = () => {
			this.saveState();
		};
		this.loadState();
		const query = this.$location.search();
		if ('share' in query) {
			axios({
				method: 'GET',
				url: 'https://api.satisfactorytools.com/v1/share/' + encodeURIComponent(query.share),
			}).then((response) => {
				$timeout(0).then(() => {
					this.$location.search('');
					const tabData: IProductionToolRequest = response.data.data;
					tabData.name = 'Shared: ' + tabData.name;
					const tab = new ProductionTab(this.scope, tabData);
					this.tabs.push(tab);
					this.tab = tab;
				});
			}).catch(() => {
				this.$location.search('');
			});
		}
	}

	public addEmptyTab(): void
	{
		this.addingInProgress = true;
		this.$timeout(0).then(() => {
			const tab = new ProductionTab(this.scope);
			this.tabs.push(tab);
			this.tab = tab;
			this.addingInProgress = false;
		});
		this.saveState();
	}

	public cloneTab(tab: ProductionTab): void
	{
		this.cloningInProgress = true;
		this.$timeout(0).then(() => {
			const clone = new ProductionTab(this.scope);
			clone.tool.productionRequest = angular.copy(tab.tool.productionRequest);
			clone.tool.productionRequest.name = 'Clone: ' + clone.tool.name;
			this.tabs.push(clone);
			this.tab = clone;
			this.cloningInProgress = false;
		});
		this.saveState();
	}

	public removeTab(tab: ProductionTab): void
	{
		const index = this.tabs.indexOf(tab);
		if (index !== -1) {
			if (tab === this.tab) {
				let newIndex = index - 1;
				if (newIndex < 0) {
					newIndex = index + 1;
				}
				this.tab = newIndex in this.tabs ? this.tabs[newIndex] : null;
			}

			tab.unregister();
			this.tabs.splice(index, 1);
			if (this.tabs.length === 0) {
				this.addEmptyTab();
			}
		}
		this.saveState();
	}

	public clearAllTabs(): void
	{
		this.tabs.forEach((tab: ProductionTab, index: number) => {
			tab.unregister();
		});
		this.tabs = [];
		this.addEmptyTab();
	}

	public getItem(className: string): IItemSchema
	{
		return model.getItem(className).prototype;
	}

	private saveState(): void
	{
		const save: IProductionToolRequest[] = [];
		for (const tab of this.tabs) {
			save.push(tab.tool.productionRequest);
		}
		this.dataStorageService.saveData('production', save);
	}

	private loadState(): void
	{
		const loaded = this.dataStorageService.loadData('production', null);
		if (loaded === null) {
			this.addEmptyTab();
		} else {
			for (const item of loaded) {
				this.tabs.push(new ProductionTab(this.scope, item));
			}
			if (this.tabs.length) {
				this.tab = this.tabs[0];
			} else {
				this.addEmptyTab();
			}
		}
	}

}

export interface IProductionControllerScope extends IScope
{

	$timeout: ITimeoutService;
	saveState: () => void;

}
