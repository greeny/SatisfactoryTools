import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map} from 'rxjs/operators';
import {loadedJsonSchema} from '@src/Store/RootActions';
import {loadedRecipes} from '@src/Store/RecipeActions';

@Injectable({providedIn: 'root'})
export class RecipeEffects
{
	onJsonSchemaLoaded$ = createEffect(() => this.actions.pipe(
		ofType(loadedJsonSchema),
		map((action) => {
			return loadedRecipes({data: Object.values(action.schema.recipes)});
		})
	));

	public constructor(private actions: Actions)
	{
	}
}
