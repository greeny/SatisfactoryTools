import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {addEmptyProduct, addEmptyTab, addProductToCurrentTab, addTab, changeRawResources, defaultRawResources, selectTab, zeroRawResources} from '@src/Store/CalculatorActions';
import {concatMap, filter, map, withLatestFrom} from 'rxjs/operators';
import {ApplicationState, selectCalculatorCurrentTab, selectCalculatorTabsLength} from '@src/Store/index';
import {Store} from '@ngrx/store';
import {Constants} from '@src/Constants';
import {IProductionToolRequest} from '@src/Tools/Production/IProductionToolRequest';
import {ProductionRequestSchemaConverter} from '@src/Tools/Production/ProductionRequestSchemaConverter';

@Injectable({providedIn: 'root'})
export class CalculatorEffects
{
	onAddEmptyTab$ = createEffect(() => this.actions.pipe(
		ofType(addEmptyTab),
		withLatestFrom(
			this.store$.select(selectCalculatorTabsLength),
		),
		concatMap(([action, tabsLength]) => {
			const tab: IProductionToolRequest = ProductionRequestSchemaConverter.convert({
				icon: null,
				version: null,
				blockedRecipes: [],
				blockedResources: [],
				input: [],
				production: [],
				resourceMax: {...Constants.RESOURCE_AMOUNTS},
				resourceWeight: {...Constants.RESOURCE_WEIGHTS},
				allowedAlternateRecipes: [],
				name: 'Unnamed factory',
				tab: 'production',
				state: {
					expanded: true,
				}
			});
			return [
				addTab({tab: tab}),
				selectTab({index: tabsLength})
			];
		})
	));

	onAddEmptyProduct$ = createEffect(() => this.actions.pipe(
		ofType(addEmptyProduct),
		withLatestFrom(this.store$.select(selectCalculatorCurrentTab)),
		filter(([action, currentTab]) => {
			return !!currentTab;
		}),
		map(([action, currentTab]) => {
			return addProductToCurrentTab({
				item: {
					item: null,
					type: Constants.PRODUCTION_TYPE.PER_MINUTE,
					amount: 10,
					ratio: 100,
				}
			});
		})
	));

	onSetRawResourcesToZero$ = createEffect(() => this.actions.pipe(
		ofType(zeroRawResources),
		map((action) => {
			const resources = {...Constants.RESOURCE_AMOUNTS};
			Object.keys(resources).forEach((key: string) => {
				resources[key] = 0;
			});

			return changeRawResources({raw: resources});
		})
	));

	onSetRawResourcesToDefault$ = createEffect(() => this.actions.pipe(
		ofType(defaultRawResources),
		map((action) => {
			const resources = {...Constants.RESOURCE_AMOUNTS};

			return changeRawResources({raw: resources});
		})
	));

	public constructor(private actions: Actions, private store$: Store<ApplicationState>)
	{
	}
}
