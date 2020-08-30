import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType, OnInitEffects} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {HttpClient} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';
import {IJsonSchema} from '@src/Schema/IJsonSchema';
import {loadedJsonSchema, loadJsonSchema} from '@src/Store/RootActions';

@Injectable({providedIn: 'root'})
export class RootEffects implements OnInitEffects
{
	onLoadSchema$ = createEffect(() => this.actions.pipe(
		ofType(loadJsonSchema),
		switchMap(() => {
			return this.httpClient
				.get<IJsonSchema>('/data/data.json')
				.pipe(
					map(response => {
						return loadedJsonSchema({schema: response});
					})
				);
		})
	));

	public constructor(private httpClient: HttpClient, private actions: Actions)
	{
	}

	public ngrxOnInitEffects(): Action
	{
		return loadJsonSchema({});
	}
}
