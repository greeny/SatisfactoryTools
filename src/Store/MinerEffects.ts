import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map} from 'rxjs/operators';
import {loadedJsonSchema} from '@src/Store/RootActions';
import {loadedMiners} from '@src/Store/MinerActions';

@Injectable({providedIn: 'root'})
export class MinerEffects
{
	onJsonSchemaLoaded$ = createEffect(() => this.actions.pipe(
		ofType(loadedJsonSchema),
		map((action) => {
			return loadedMiners({data: Object.values(action.schema.miners)});
		})
	));

	public constructor(private actions: Actions)
	{
	}
}
