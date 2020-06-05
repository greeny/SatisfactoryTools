import {ProductionTool} from '@src/Tools/Production/ProductionTool';
import model from '@src/Data/Model';
import {IScope} from 'angular';
import {ProductionTab} from '@src/Tools/Production/ProductionTab';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {Constants} from '@src/Constants';

export class ProductionController
{

	public tab: ProductionTab|null = null;
	public tabs: ProductionTab[] = [];
	public readonly tool: ProductionTool;
	public readonly craftableItems: IItemSchema[] = model.getAutomatableItems();
	public result: string;

	public options: {} = {
		'items/min': Constants.PRODUCTION_TYPE.PER_MINUTE,
		'maximize': Constants.PRODUCTION_TYPE.MAXIMIZE,
	};

	public static $inject = ['$scope'];
	private readonly scope: IScope;

	public constructor(scope: IScope)
	{
		this.tool = new ProductionTool;
		this.scope = scope;
	}

	public addNewTab(): void
	{
		this.tabs.push(new ProductionTab(this.scope));
		this.tab = this.tabs[this.tabs.length - 1];
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

}
