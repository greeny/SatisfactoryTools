import {createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {IResourceSchema} from '@src/Schema/IResourceSchema';
import {loadedResources} from '@src/Store/ResourceActions';

export interface IState extends EntityState<IResourceSchema>
{
}

const selectId = (a: IResourceSchema): string => {
	return a.item;
};

const sortByName = (a: IResourceSchema, b: IResourceSchema): number => {
	return a.item.localeCompare(b.item);
};

export const adapter: EntityAdapter<IResourceSchema> = createEntityAdapter<IResourceSchema>({
	selectId: selectId,
	sortComparer: sortByName,
});

const reducerFnReference = createReducer(adapter.getInitialState(),
	on(loadedResources, (state, action) => {
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
