import {createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {IMinerSchema} from '@src/Schema/IMinerSchema';
import {loadedMiners} from '@src/Store/MinerActions';

export interface IState extends EntityState<IMinerSchema>
{
}

const selectId = (a: IMinerSchema): string => {
	return a.className;
};

const sortByName = (a: IMinerSchema, b: IMinerSchema): number => {
	return a.className.localeCompare(b.className);
};

export const adapter: EntityAdapter<IMinerSchema> = createEntityAdapter<IMinerSchema>({
	selectId: selectId,
	sortComparer: sortByName,
});

const reducerFnReference = createReducer(adapter.getInitialState(),
	on(loadedMiners, (state, action) => {
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
