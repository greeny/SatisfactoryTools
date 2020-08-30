import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map} from 'rxjs/operators';
import {loadedJsonSchema} from '@src/Store/RootActions';
import {loadedResources} from '@src/Store/ResourceActions';

@Injectable({providedIn: 'root'})
export class ResourceEffects
{
	onJsonSchemaLoaded$ = createEffect(() => this.actions.pipe(
		ofType(loadedJsonSchema),
		map((action) => {
			return loadedResources({data: Object.values(action.schema.resources)});
		})
	));

	public constructor(private actions: Actions)
	{
	}
}
