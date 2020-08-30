import {createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {IGeneratorSchema} from '@src/Schema/IGeneratorSchema';
import {loadedGenerators} from '@src/Store/GeneratorActions';

export interface IState extends EntityState<IGeneratorSchema>
{
}

const selectId = (a: IGeneratorSchema): string => {
	return a.className;
};

const sortByName = (a: IGeneratorSchema, b: IGeneratorSchema): number => {
	return a.className.localeCompare(b.className);
};

export const adapter: EntityAdapter<IGeneratorSchema> = createEntityAdapter<IGeneratorSchema>({
	selectId: selectId,
	sortComparer: sortByName,
});

const reducerFnReference = createReducer(adapter.getInitialState(),
	on(loadedGenerators, (state, action) => {
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
