import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ItemsDataProvider} from '@modules/Codex/Service/DataProvider';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {Sort} from '@utils/Sort';
import {TrackBy} from '@utils/TrackBy';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {distinctUntilChanged, map, withLatestFrom} from 'rxjs/operators';

interface IFilter
{
	filter: string;
	radioactive: boolean|null;
	withEnergy: boolean|null;
	stackSize: number|null;
	physicalState: 'solid'|'liquid'|null
}

@Component({
	selector:    'sf-codex-items',
	templateUrl: './ItemsComponent.html'
})
export class ItemsComponent implements OnInit, OnDestroy
{
	public items$: Observable<IItemSchema[]>;
	public advancedFiltersCollapsed: boolean = true;
	public stackSizes = [
		{value: null, label: 'Any'},
		{value: 1, label: '1'},
		{value: 50, label: '50'},
		{value: 100, label: '100'},
		{value: 200, label: '200'},
		{value: 500, label: '500'}
	];
	public physicalStates = [
		{value: null, label: 'Any'},
		{value: 'solid', label: 'Solid'},
		{value: 'liquid', label: 'Liquid'}
	];
	public filterInitialState: IFilter = {
		filter:        '',
		physicalState: null,
		radioactive:   null,
		stackSize:     null,
		withEnergy:    null
	};
	public form = new FormGroup({
		filter:        new FormControl(),
		radioactive:   new FormControl(),
		withEnergy:    new FormControl(),
		stackSize:     new FormControl(),
		physicalState: new FormControl()
	});
	public trackByClassName = TrackBy.byClassName;
	private subscription: Subscription;
	private search$ = new BehaviorSubject<IFilter>(this.filterInitialState);

	constructor(private itemsProvider: ItemsDataProvider)
	{
	}

	clearQuery()
	{
		this.form.get('filter').setValue('');
	}

	ngOnInit(): void
	{
		this.subscription = this.form.valueChanges.subscribe(r => this.search$.next(r));
		this.items$ = this.search$.pipe(
			withLatestFrom(this.itemsProvider.getAll()),
			distinctUntilChanged(),
			map<[IFilter, IItemSchema[]], IItemSchema[]>(([filter, data]) => {
				return data
					.filter(item => {
						return item.name.toLowerCase().indexOf(filter.filter.toLowerCase()) !== -1;
					})
					.filter(item => {
						if (true === filter.radioactive) {
							return item.radioactiveDecay > 0;
						}
						return true;
					})
					.filter(item => {
						if (true === filter.withEnergy) {
							return item.energyValue > 0;
						}
						return true;
					})
					.filter(item => {
						if (null !== filter.stackSize) {
							return item.stackSize === filter.stackSize;
						}
						return true;
					})
					.filter(item => {
						if (null !== filter.physicalState) {
							return 'liquid' === filter.physicalState ? item.liquid : !item.liquid;
						}
						return true;
					})
					.sort(Sort.sortBySlug);
			})
		);
		this.form.setValue(this.filterInitialState);
	}

	ngOnDestroy(): void
	{
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}
