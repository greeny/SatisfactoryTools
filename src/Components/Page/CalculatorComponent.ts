import {Component} from '@angular/core';
import {ProductionTab} from '@src/Tools/Production/ProductionTab';
import {Store} from '@ngrx/store';
import {ApplicationState, selectAllItems, selectAllResources, selectCalculatorState} from '@src/Store';
import {Observable} from 'rxjs';
import {ICalculatorState} from '@src/Types/ICalculatorState';
import {
	addEmptyProduct,
	addEmptyTab,
	changeIconForCurrentTab, changeRawResourceAmount,
	changeTabMode,
	cloneTab,
	defaultRawResources,
	removeTab,
	selectTab,
	toggleExpandedStateForCurrentTab,
	toggleTabResource, zeroRawResources
} from '@src/Store/CalculatorActions';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {IProductionToolRequestTabs} from '@src/Tools/Production/IProductionToolRequest';
import {IResourceSchema} from '@src/Schema/IResourceSchema';

@Component({
	selector: 'st-calculator',
	templateUrl: '../../../templates/Components/CalculatorComponent.html'
})
export class CalculatorComponent
{
	public tab: ProductionTab|null = null;
	public calculatorState$: Observable<ICalculatorState>;
	public craftableItems$: Observable<IItemSchema[]>;
	public resources$: Observable<IResourceSchema[]>;
	public addingInProgress = false;
	public cloningInProgress = false;

	public constructor(private store$: Store<ApplicationState>)
	{
		this.calculatorState$ = this.store$.select(selectCalculatorState);
		this.craftableItems$ = this.store$.select(selectAllItems);
		this.resources$ = this.store$.select(selectAllResources);
	}

	public addEmptyTab()
	{
		this.store$.dispatch(addEmptyTab());
	}

	public cloneTab(): void
	{
		this.store$.dispatch(cloneTab());
	}

	public removeTab(): void
	{
		this.store$.dispatch(removeTab());
	}

	public selectTab(index: number)
	{
		this.store$.dispatch(selectTab({index: index}));
	}

	public addEmptyProduct()
	{
		this.store$.dispatch(addEmptyProduct());
	}

	public changeMode(mode: IProductionToolRequestTabs): void
	{
		this.store$.dispatch(changeTabMode({mode: mode}));
	}

	public changeCurrentTabIcon(icon: IItemSchema): void
	{
		this.store$.dispatch(changeIconForCurrentTab({item: icon}));
	}

	public toggleExpandedState()
	{
		this.store$.dispatch(toggleExpandedStateForCurrentTab());
	}

	public toggleResource(item: string)
	{
		this.store$.dispatch(toggleTabResource({item: item}));
	}

	public setDefaultRawResources()
	{
		this.store$.dispatch(defaultRawResources());
	}

	public zeroRawResources()
	{
		this.store$.dispatch(zeroRawResources());
	}

	public changeResource(item: string, value: string)
	{
		this.store$.dispatch(changeRawResourceAmount({key: item, amount: parseInt(value, 10)}));
	}
}
