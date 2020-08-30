import {createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {loadedBuildings} from '@src/Store/BuildingActions';

export interface IState extends EntityState<IBuildingSchema>
{
}

const selectId = (a: IBuildingSchema): string => {
	return a.className;
};

const sortByName = (a: IBuildingSchema, b: IBuildingSchema): number => {
	return a.name.localeCompare(b.name);
};

export const adapter: EntityAdapter<IBuildingSchema> = createEntityAdapter<IBuildingSchema>({
	selectId: selectId,
	sortComparer: sortByName,
});

const reducerFnReference = createReducer(adapter.getInitialState(),
	on(loadedBuildings, (state, action) => {
		return adapter.addMany(action.data, state);
	})
);

export function reducer(state, action)
{
	return reducerFnReference(state, action);
}

export const {
	selectIds,
	selectEntities,
	selectAll,
	selectTotal,
} = adapter.getSelectors();
