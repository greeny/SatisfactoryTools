import {IItemSchema} from '@src/Schema/IItemSchema';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IItemFilterSet} from '@src/Types/IItemFilterSet';
import {IBuildingFilterSet} from '@src/Types/IBuildingFilterSet';

export interface IFilterService<E extends IItemSchema|IBuildingSchema>
{
	filter: (E extends IItemSchema ? IItemFilterSet : IBuildingFilterSet);
	entities: E[];

	resetFilters(): void;

	filterEntities(): E[];
}
