import {createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {ISchematicSchema} from '@src/Schema/ISchematicSchema';
import {loadedSchematics} from '@src/Store/SchematicActions';

export interface IState extends EntityState<ISchematicSchema>
{
}

const selectId = (a: ISchematicSchema): string => {
	return a.className;
};

const sortByName = (a: ISchematicSchema, b: ISchematicSchema): number => {
	return a.name.localeCompare(b.name);
};

export const adapter: EntityAdapter<ISchematicSchema> = createEntityAdapter<ISchematicSchema>({
	selectId: selectId,
	sortComparer: sortByName,
});

const reducerFnReference = createReducer(adapter.getInitialState(),
	on(loadedSchematics, (state, action) => {
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
