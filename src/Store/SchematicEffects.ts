import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map} from 'rxjs/operators';
import {loadedJsonSchema} from '@src/Store/RootActions';
import {loadedSchematics} from '@src/Store/SchematicActions';

@Injectable({providedIn: 'root'})
export class SchematicEffects
{
	onJsonSchemaLoaded$ = createEffect(() => this.actions.pipe(
		ofType(loadedJsonSchema),
		map((action) => {
			return loadedSchematics({data: Object.values(action.schema.schematics)});
		})
	));

	public constructor(private actions: Actions)
	{
	}
}
