import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map} from 'rxjs/operators';
import {loadedBuildings} from '@src/Store/BuildingActions';
import {loadedJsonSchema} from '@src/Store/RootActions';

@Injectable({providedIn: 'root'})
export class BuildingEffects
{
	onJsonSchemaLoaded$ = createEffect(() => this.actions.pipe(
		ofType(loadedJsonSchema),
		map((action) => {
			return loadedBuildings({data: Object.values(action.schema.buildings)});
		})
	));

	public constructor(private actions: Actions)
	{
	}
}
