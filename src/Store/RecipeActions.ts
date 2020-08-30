import {createAction, props} from '@ngrx/store';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';

export const loadedRecipes = createAction('[Recipe] Loaded JSON', props<{ data: IRecipeSchema[] }>());
