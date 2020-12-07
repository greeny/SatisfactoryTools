import {Component, OnDestroy, OnInit}              from '@angular/core';
import {FormControl, FormGroup}                    from '@angular/forms';
import {SchematicsDataProvider}                    from '@modules/Codex/Service/DataProvider';
import {ISchematicSchema}                          from '@src/Schema/ISchematicSchema';
import {TrackBy}                                   from '@utils/TrackBy';
import {Sort}                                      from '@utils/Sort';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {distinctUntilChanged, map, withLatestFrom} from 'rxjs/operators';

interface IFilter {
	filter: string;
}

@Component({
	selector:    'sf-codex-schematics',
	templateUrl: './SchematicsComponent.html'
})
export class SchematicsComponent implements OnInit, OnDestroy {
	public items$: Observable<ISchematicSchema[]>;
	public advancedFiltersCollapsed: boolean = true;
	public trackByClassName = TrackBy.byClassName;
	public form = new FormGroup({
		filter: new FormControl()
	});
	public filterInitialState: IFilter = {
		filter: ''
	};

	private subscription: Subscription;
	private search$ = new BehaviorSubject<IFilter>(this.filterInitialState);

	constructor(private itemsProvider: SchematicsDataProvider) {
	}

	ngOnInit(): void {
		this.subscription = this.form.valueChanges.subscribe(r => this.search$.next(r));
		this.items$ = this.search$.pipe(
			withLatestFrom(this.itemsProvider.getAll()),
			distinctUntilChanged(),
			map<[IFilter, ISchematicSchema[]], ISchematicSchema[]>(([filter, data]) => {
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
