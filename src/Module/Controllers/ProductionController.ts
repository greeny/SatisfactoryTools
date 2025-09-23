import model from '@src/Data/Model';
import * as angular from 'angular';
import {ILocationService, IScope, ITimeoutService} from 'angular';
import {ProductionTab} from '@src/Tools/Production/ProductionTab';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {Constants} from '@src/Constants';
import data, {Data} from '@src/Data/Data';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {IResourceSchema} from '@src/Schema/IResourceSchema';
import {DataStorageService} from '@src/Module/Services/DataStorageService';
import axios from 'axios';
import {IProductionData} from '@src/Tools/Production/IProductionData';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {FileExporter} from '@src/Export/FileExporter';
import {Strings} from '@src/Utils/Strings';
import {IRootScope} from '@src/Types/IRootScope';

export class ProductionController
{

	public selectedTabs: ProductionTab[] = [];
	public tab: ProductionTab|null = null;
	public tabs: ProductionTab[] = [];
	public addingInProgress: boolean;
	public cloningInProgress: boolean;
	public importOpen: boolean = false;
	public importFiles: File[] = [];

	public readonly rawResources: IResourceSchema[] = data.getResources();
	public readonly craftableItems: IItemSchema[] = model.getAutomatableItems();
	public readonly inputableItems: IItemSchema[] = model.getInputableItems();
	public readonly sinkableItems: IItemSchema[] = data.getSinkableItems();
	public readonly alternateRecipes: IRecipeSchema[] = data.getAlternateRecipes();
	public readonly basicRecipes: IRecipeSchema[] = data.getBaseItemRecipes();
	public readonly machines: IBuildingSchema[] = data.getManufacturers();
	public readonly recipes: IRecipeSchema[] = this.basicRecipes.concat(this.alternateRecipes);

	public result: string;

	public options: {} = {
		'items/min': Constants.PRODUCTION_TYPE.PER_MINUTE,
		'maximize': Constants.PRODUCTION_TYPE.MAXIMIZE,
	};

	public static $inject = ['$scope', '$timeout', 'DataStorageService', '$location', '$rootScope'];
	private readonly storageKey: string;

	public constructor(
		private readonly scope: IProductionControllerScope,
		private readonly $timeout: ITimeoutService,
		private readonly dataStorageService: DataStorageService,
		private readonly $location: ILocationService,
		private readonly $rootScope: IRootScope,
	)
	{
		if ($rootScope.version === '1.0') {
			this.storageKey = 'production1';
		} else if ($rootScope.version === '1.0-ficsmas') {
			this.storageKey = 'production-ficsmas';
		} else {
			this.storageKey = 'tmpProduction';
		}

		scope.$timeout = $timeout;
		scope.saveState = () => {
			this.saveState();
		};
		this.loadState();
		$timeout(() => {
			const query = this.$location.search();
			if ('share' in query) {
				axios({
					method: 'GET',
					url: 'https://api.satisfactorytools.com/v2/share/' + encodeURIComponent(query.share),
				}).then((response) => {
					$timeout(0).then(() => {
						const tabData: IProductionData = response.data.data;
						tabData.metadata.name = 'Shared: ' + tabData.metadata.name;
						const tab = new ProductionTab(this.scope, $rootScope.version, tabData);
						this.tabs.push(tab);
						this.tab = tab;
						this.saveState();
						this.$location.search('');
					});
				}).catch(() => {
					this.$location.search('');
				});
			}
		});
	}

	public toggleImport(): void
	{
		this.importOpen = !this.importOpen;
	}

	public tryImport(): void
	{
		const input: HTMLInputElement = document.getElementById('importFile') as HTMLInputElement;
		const files = input.files as FileList;

		if (files.length === 0) {
			return;
		}

		const file = files[0];
		const reader = new FileReader();
		reader.readAsText(file, 'utf-8');
		reader.onload = () => {
			try {
				const tabs = FileExporter.importTabs(reader.result as string);

				for (const tab of tabs) {
					if (JSON.stringify(tab.request.resourceMax) === JSON.stringify(Data.resourceAmountsU8)) {
						tab.request.resourceMax = Data.resourceAmounts;
					}

					if (typeof tab.request.resourceMax.Desc_SAM_C === 'undefined') {
						tab.request.resourceMax.Desc_SAM_C = 0;
					}

					tab.request.resourceWeight = Data.resourceWeights;
					this.tabs.push(new ProductionTab(this.scope, this.$rootScope.version, tab));
				}

				Strings.addNotification('Import complete', 'Successfuly imported ' + tabs.length + ' tab' + (tabs.length === 1 ? '' : 's') + '.');
				this.scope.$apply();
				input.value = '';
			} catch (e) {
				Strings.addNotification('ERROR', 'Couldn\'t import file: ' + e.message, 5000);
				return;
			}
		}
	}

	public selectAllTabs(): void
	{
		this.selectedTabs = [];
		for (const tab of this.tabs) {
			this.selectedTabs.push(tab);
		}
	}

	public toggleTab(tab: ProductionTab): void
	{
		const index = this.selectedTabs.indexOf(tab);
		if (index === -1) {
			this.selectedTabs.push(tab);
		} else {
			this.selectedTabs.splice(index, 1);
		}
	}

	public isTabSelected(tab: ProductionTab): boolean
	{
		return this.selectedTabs.indexOf(tab) !== -1;
	}

	public removeSelectedTabs(): void
	{
		if (this.selectedTabs.length === 0) {
			return;
		}
		if (confirm('Do you really want to remove ' + this.selectedTabs.length + ' tab' + (this.selectedTabs.length > 1 ? 's?' : '?'))) {
			for (const tab of this.selectedTabs) {
				this.removeTab(tab);
			}
			this.selectedTabs = [];
		}
	}

	public exportSelectedTabs(): void
	{
		if (this.selectedTabs.length === 0) {
			return;
		}
		Strings.downloadFile('sftools-export-' + Strings.dateToIso(new Date()) + '.sft', FileExporter.exportTabs(this.selectedTabs));
	}

	public addEmptyTab(): void
	{
		this.addingInProgress = true;
		this.$timeout(0).then(() => {
			const tab = new ProductionTab(this.scope, this.$rootScope.version);
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
			const clone = new ProductionTab(this.scope, this.$rootScope.version);
			clone.data.request = angular.copy(tab.data.request);
			clone.data.metadata.name = 'Clone: ' + clone.data.metadata.name;
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

	public getBuilding(className: string): IBuildingSchema|null
	{
		return data.getRawData().buildings[className];
	}

	public getRecipe(className: string): IRecipeSchema|null
	{
		return data.getRawData().recipes[className];
	}

	private saveState(): void
	{
		const save: IProductionData[] = [];
		for (const tab of this.tabs) {
			save.push(tab.data);
		}
		this.dataStorageService.saveData(this.storageKey, save);
	}

	private loadState(): void
	{
		const loaded = this.dataStorageService.loadData(this.storageKey, null);
		if (loaded === null) {
			this.addEmptyTab();
		} else {
			for (const item of loaded) {
				this.tabs.push(new ProductionTab(this.scope, this.$rootScope.version, item));
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
