import {Component, OnDestroy, OnInit}              from '@angular/core';
import {FormControl, FormGroup}                    from '@angular/forms';
import {BuildingsDataProvider}                     from '@modules/Codex/Service/DataProvider';
import {IBuildingSchema}                           from '@src/Schema/IBuildingSchema';
import {Sort}                                      from '@utils/Sort';
import {TrackBy}                                   from '@utils/TrackBy';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {distinctUntilChanged, map, withLatestFrom} from 'rxjs/operators';

interface IFilter {
	filter: string;
}

@Component({
	selector:    'sf-codex-buildings',
	templateUrl: './BuildingsComponent.html'
})
export class BuildingsComponent implements OnInit, OnDestroy {
	public items$: Observable<IBuildingSchema[]>;
	public advancedFiltersCollapsed: boolean = true;
	public trackByClassName = TrackBy.byClassName;
	public form = new FormGroup({
		filter:        new FormControl(),
	});
	public filterInitialState: IFilter = {
		filter:        ''
	};

	private subscription: Subscription;
	private search$ = new BehaviorSubject<IFilter>(this.filterInitialState);

	constructor(private itemsProvider: BuildingsDataProvider) {
	}

	ngOnInit(): void {
		this.subscription = this.form.valueChanges.subscribe(r => this.search$.next(r));
		this.items$ = this.search$.pipe(
			withLatestFrom(this.itemsProvider.getAll()),
			distinctUntilChanged(),
			map<[IFilter, IBuildingSchema[]], IBuildingSchema[]>(([filter, data]) => {
				return data
					.filter(item => {
						return item.name.toLowerCase().indexOf(filter.filter.toLowerCase()) !== -1;
					})
					.sort(Sort.sortBySlug);
			})
		);
		this.form.setValue(this.filterInitialState);
	}

	clearQuery() {
		this.form.get('filter').setValue('');
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}
