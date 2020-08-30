import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {Store} from '@ngrx/store';
import {ApplicationState, selectAllBuildings, selectAllItems} from '@src/Store';
import {concat, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

type AcceptableSchemasType = IBuildingSchema|IItemSchema;

@Component({
	selector: 'item-icon',
	templateUrl: '../../templates/Components/ItemIconComponent.html'
})
export class ItemIconComponent implements OnChanges
{
	@Input() item: string|AcceptableSchemasType;
	@Input('hide-tooltip') hideTooltip = false;
	@Input() size = 64;
	url$: Observable<string>;
	entry$: Observable<AcceptableSchemasType>;
	imageSize: number = 64;
	private defaultSize: number = 64;

	public constructor(private store$: Store<ApplicationState>)
	{
	}

	public ngOnChanges(changes: SimpleChanges): void
	{
		this.reload();
	}

	private reload(): void
	{
		this.imageSize = this.size <= this.defaultSize ? 64 : 256;
		if (typeof this.item === 'string') {
			this.entry$ = concat(
				this.store$.select(selectAllItems),
				this.store$.select(selectAllBuildings),
			).pipe(
				map((data: AcceptableSchemasType[]) => {
					return data.filter((entry: AcceptableSchemasType) => {
						return entry.className === this.item;
					});
				}),
				map(entry => {
					return entry[0];
				})
			);
		} else {
			this.entry$ = of(this.item);
		}
	}
}
