import data from '@src/Data/Data';
import {IFilterService} from '@src/Types/IFilterService';
import {ISchematicSchema} from '@src/Schema/ISchematicSchema';
import {ISchematicFilterSet} from '@src/Types/ISchematicFilterSet';

export class SchematicFiltersService implements IFilterService<ISchematicSchema>
{

	public filter: ISchematicFilterSet;
	public entities: ISchematicSchema[] = Object.values(data.getAllSchematics());

	private defaultFilterState: ISchematicFilterSet = {
		query: '',
		showAdvanced: false,
	};

	public constructor()
	{
		this.filter = {...this.defaultFilterState};
	}

	public resetFilters(): void
	{
		this.filter = {...this.defaultFilterState, showAdvanced: this.filter.showAdvanced};
	}

	public filterEntities(): ISchematicSchema[]
	{
		// Copy instead of working on original collection
		let schematics = [...this.entities];

		if (this.filter.query) {
			schematics = schematics.filter((schematic) => {
				return schematic.name.toLowerCase().indexOf(this.filter.query.toLowerCase()) !== -1;
			});
		}

		return schematics;
	}

}
