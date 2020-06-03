import {ProductionTool} from '@src/Tools/Production/ProductionTool';
import model from '@src/Data/Model';
import {Item} from '@src/Data/Item';
import {IOnInit, IScope} from 'angular';
import {ProductionTab} from '@src/Tools/Production/ProductionTab';
import {ItemAmount} from '@src/Data/ItemAmount';
import {ngStorage} from 'ngstorage';
import {ILocalStorageProductionState} from '@src/Types/ILocalStorageProductionState';

export class ProductionController implements IOnInit
{

	public tab: ProductionTab|null = null;
	public tabs: ProductionTab[] = [];
	public readonly tool: ProductionTool;
	public readonly craftableItems: Item[] = model.getAutomatableItems();
	public result: string;

	public static $inject = ['$scope', '$localStorage'];
	private readonly scope: IScope;

	public constructor(scope: IScope, private $localStorage: ngStorage.StorageService)
	{
		this.tool = new ProductionTool;
		this.scope = scope;
	}

	public addNewTab(): void
	{
		this.tabs.push(new ProductionTab(this.scope));
		this.tab = this.tabs[this.tabs.length - 1];
		this.populateToolToStorage();
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
			this.populateToolToStorage();
		}
	}

	public addEmptyProduct(): void
	{
		this.tab?.addProduct(new ItemAmount(this.craftableItems[0], 1));
		this.populateToolToStorage();
	}

	public modelChanged(): void
	{
		this.populateToolToStorage();
	}

	public $onInit(): void
	{
		if (!this.$localStorage.productionState) {
			return;
		}
		const savedState = this.$localStorage.productionState as ILocalStorageProductionState[];
		savedState.forEach((savedTab) => {
			const productionTab = new ProductionTab(this.scope);
			savedTab.items.forEach((savedItem) => {
				const savedItemReference = this.craftableItems.find((craftableItem) => {
					return craftableItem.prototype.className === savedItem.item;
				});
				if (savedItemReference) {
					const savedItemAmount = new ItemAmount(savedItemReference, savedItem.amount, savedItem.max, savedItem.ratio);
					productionTab.addProduct(savedItemAmount);
				}
			});
			this.tabs.push(productionTab);
		});
		if (this.tabs.length) {
			this.tab = this.tabs[0];
		}
	}

	private populateToolToStorage(): void
	{
		const localStorageState: ILocalStorageProductionState[] = [];
		this.tabs.forEach((tab) => {
			const tabState: ILocalStorageProductionState = {
				items: tab.tool.productionRequest.production.map((itemAmount) => {
					return {
						amount: itemAmount.amount,
						ratio: itemAmount.ratio,
						max: itemAmount.max,
						item: itemAmount.item.prototype.className,
					};
				}),
			};
			localStorageState.push(tabState);
		});
		this.$localStorage.productionState = localStorageState;
	}
}
