import {IItemSchema} from '@src/Schema/IItemSchema';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IItemFilterSet} from '@src/Types/IItemFilterSet';
import {IBuildingFilterSet} from '@src/Types/IBuildingFilterSet';
import {ISchematicSchema} from '@src/Schema/ISchematicSchema';
import {ISchematicFilterSet} from '@src/Types/ISchematicFilterSet';

export interface IFilterService<E extends IItemSchema|IBuildingSchema|ISchematicSchema>
{

	filter: (E extends IItemSchema ? IItemFilterSet : (E extends IBuildingSchema ? IBuildingFilterSet : ISchematicFilterSet));
	entities: E[];

	resetFilters(): void;

	filterEntities(): E[];

}
