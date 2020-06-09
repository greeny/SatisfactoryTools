import {ProductionTool} from '@src/Tools/Production/ProductionTool';
import model from '@src/Data/Model';
import * as angular from 'angular';
import {IScope, ITimeoutService} from 'angular';
import {ProductionTab} from '@src/Tools/Production/ProductionTab';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {Constants} from '@src/Constants';
import data from '@src/Data/Data';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {IResourceSchema} from '@src/Schema/IResourceSchema';

export class ProductionController
{

	public tab: ProductionTab|null = null;
	public tabs: ProductionTab[] = [];
	public addingInProgress: boolean;
	public cloningInProgress: boolean;
	public readonly tool: ProductionTool;
	public readonly rawResources: IResourceSchema[] = data.getResources();
	public readonly craftableItems: IItemSchema[] = model.getAutomatableItems();
	public readonly alternateRecipes: IRecipeSchema[] = data.getAlternateRecipes();
	public readonly basicRecipes: IRecipeSchema[] = data.getBaseItemRecipes();

	public result: string;

	public options: {} = {
		'items/min': Constants.PRODUCTION_TYPE.PER_MINUTE,
		'maximize': Constants.PRODUCTION_TYPE.MAXIMIZE,
	};

	public static $inject = ['$scope', '$timeout'];

	public constructor(private readonly scope: IProductionControllerScope, private readonly $timeout: ITimeoutService)
	{
		this.tool = new ProductionTool;
		scope.$timeout = $timeout;
		this.addEmptyTab();
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
		}
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

}

export interface IProductionControllerScope extends IScope
{

	$timeout: ITimeoutService;

}
