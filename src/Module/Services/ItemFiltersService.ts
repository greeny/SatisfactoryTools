import {IItemFilterSet} from '@src/Types/IItemFilterSet';
import {IItemSchema} from '@src/Schema/IItemSchema';
import data from '@src/Data/Data';
import {IFilterService} from '@src/Types/IFilterService';

export class ItemFiltersService implements IFilterService<IItemSchema>
{

	public filter: IItemFilterSet;
	public entities: IItemSchema[] = Object.values(data.getAllItems());

	private defaultFilterState: IItemFilterSet = {
		showAdvanced: false,
		query: '',
		onlyRadioactive: false,
		onlyWithEnergyValue: false,
		stackSize: null,
		physicalState: null,
	};

	public constructor()
	{
		this.filter = {...this.defaultFilterState};
	}

	public resetFilters(): void
	{
		// keep advanced filters open state, and reset everything else
		this.filter = {...this.defaultFilterState, showAdvanced: this.filter.showAdvanced};
	}

	public filterEntities(): IItemSchema[]
	{
		// Copy instead of working on original collection
		let itemsToFilter = [...this.entities];
		if (this.filter.onlyRadioactive) {
			itemsToFilter = itemsToFilter.filter((item) => {
				return item.radioactiveDecay > 0;
			});
		}

		if (this.filter.onlyWithEnergyValue) {
			itemsToFilter = itemsToFilter.filter((item) => {
				return item.energyValue > 0;
			});
		}

		if (this.filter.physicalState) {
			itemsToFilter = itemsToFilter.filter((item) => {
				return ('liquid' === this.filter.physicalState) === item.liquid;
			});
		}

		if (this.filter.stackSize) {
			itemsToFilter = itemsToFilter.filter((item) => {
				if (item.liquid) {
					// Liters to m3 conversion
					return parseInt(this.filter.stackSize + '', 10) === (item.stackSize / 1000);
				}
				// parseInt because angular somehow treats option value as string
				return parseInt(this.filter.stackSize + '', 10) === item.stackSize;
			});
		}

		if (this.filter.query) {
			itemsToFilter = itemsToFilter.filter((item) => {
				return item.name.toLowerCase().indexOf(this.filter.query.toLowerCase()) !== -1;
			});
		}

		return itemsToFilter;
	}

}
