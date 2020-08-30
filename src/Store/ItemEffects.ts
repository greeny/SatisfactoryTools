import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map} from 'rxjs/operators';
import {loadedJsonSchema} from '@src/Store/RootActions';
import {loadedItems} from '@src/Store/ItemActions';

@Injectable({providedIn: 'root'})
export class ItemEffects
{
	onJsonSchemaLoaded$ = createEffect(() => this.actions.pipe(
		ofType(loadedJsonSchema),
		map((action) => {
			return loadedItems({data: Object.values(action.schema.items)});
		})
	));

	public constructor(private actions: Actions)
	{
	}
}
