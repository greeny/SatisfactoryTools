import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map} from 'rxjs/operators';
import {loadedGenerators} from '@src/Store/GeneratorActions';
import {loadedJsonSchema} from '@src/Store/RootActions';

@Injectable({providedIn: 'root'})
export class GeneratorEffects
{
	onJsonSchemaLoaded$ = createEffect(() => this.actions.pipe(
		ofType(loadedJsonSchema),
		map((action) => {
			return loadedGenerators({data: Object.values(action.schema.generators)});
		})
	));

	public constructor(private actions: Actions)
	{
	}
}
