import {createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {loadedItems} from '@src/Store/ItemActions';

export interface IState extends EntityState<IItemSchema>
{
}

const selectId = (a: IItemSchema): string => {
	return a.className;
};

const sortByName = (a: IItemSchema, b: IItemSchema): number => {
	return a.name.localeCompare(b.name);
};

export const adapter: EntityAdapter<IItemSchema> = createEntityAdapter<IItemSchema>({
	selectId: selectId,
	sortComparer: sortByName,
});

const reducerFnReference = createReducer(adapter.getInitialState(),
	on(loadedItems, (state, action) => {
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
