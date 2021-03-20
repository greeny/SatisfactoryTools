import data from '@src/Data/Data';
import {IFilterService} from '@src/Types/IFilterService';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IBuildingFilterSet} from '@src/Types/IBuildingFilterSet';

export class BuildingFiltersService implements IFilterService<IBuildingSchema>
{

	public filter: IBuildingFilterSet;
	public entities: IBuildingSchema[] = Object.values(data.getAllBuildings());

	private defaultFilterState: IBuildingFilterSet = {
		query: '',
		showAdvanced: false,
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

	public filterEntities(): IBuildingSchema[]
	{
		// Copy instead of working on original collection
		let itemsToFilter = [...this.entities];

		if (this.filter.query) {
			itemsToFilter = itemsToFilter.filter((item) => {
				return item.name.toLowerCase().indexOf(this.filter.query.toLowerCase()) !== -1;
			});
		}

		return itemsToFilter;
	}

}
