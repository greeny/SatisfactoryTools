import {createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {loadedRecipes} from '@src/Store/RecipeActions';

export interface IState extends EntityState<IRecipeSchema>
{
}

const selectId = (a: IRecipeSchema): string => {
	return a.className;
};

const sortByName = (a: IRecipeSchema, b: IRecipeSchema): number => {
	return a.className.localeCompare(b.className);
};

export const adapter: EntityAdapter<IRecipeSchema> = createEntityAdapter<IRecipeSchema>({
	selectId: selectId,
	sortComparer: sortByName,
});

const reducerFnReference = createReducer(adapter.getInitialState(),
	on(loadedRecipes, (state, action) => {
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
