import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Data} from '@src/Data/Data';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {concatMap, filter, map, withLatestFrom} from 'rxjs/operators';

interface ISelectableIcon
{
	address: string;
	name: string;
	size: number;
	tooltip?: string;
}

type AcceptableType = IItemSchema|IBuildingSchema;

@Component({
	selector:    'sf-item-icon',
	templateUrl: './ItemIconComponent.html'
})
export class ItemIconComponent implements OnChanges
{
	@Input() item: AcceptableType = null;
	@Input() size: number = 64;
	@Input() showTooltip: boolean = true;
	icon$: Observable<ISelectableIcon>;
	private readonly stack$: Observable<AcceptableType[]>;
	private itemChange$ = new BehaviorSubject<AcceptableType>(this.item);

	constructor()
	{
		const data = new Data();
		this.stack$ = of(
			[]
				.concat(Object.values(data.getAllBuildings()))
				.concat(Object.values(data.getAllItems()))
				.concat(data.getResources())
		);
		this.icon$ = this.itemChange$.pipe(
			withLatestFrom(this.stack$),
			map(([name, elements]) => {
				return elements.map((element) => [name, element]);
			}),
			concatMap(x => x),
			filter((element: [AcceptableType, AcceptableType]) => element[1].className === element[0].className),
			map(e => {
				return {
					address: `/assets/images/items/${e[1].slug}_${this.getSize()}.png`,
					name:    e[1].name,
					size:    this.size,
					tooltip: e[1].name
				};
			})
		);
	}

	ngOnChanges(changes: SimpleChanges): void
	{
		if (!changes.item) {
			return;
		}

		if (changes.item.previousValue === changes.item.currentValue) {
			return;
		}

		this.itemChange$.next(changes.item.currentValue);
	}

	private getSize(): number
	{
		if (this.size <= 64) {
			return 64;
		}

		return 256;
	}
}
