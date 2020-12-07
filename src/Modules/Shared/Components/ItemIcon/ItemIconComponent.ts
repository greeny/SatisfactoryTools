import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Data}                                       from '@src/Data/Data';
import {IBuildingSchema}                        from '@src/Schema/IBuildingSchema';
import {IItemSchema}                            from '@src/Schema/IItemSchema';
import {BehaviorSubject, Observable, of}        from 'rxjs';
import {concatMap, filter, map, withLatestFrom} from 'rxjs/operators';

interface ISelectableIcon {
	address: string;
	name: string;
	size: number;
}

type AcceptableType = IItemSchema | IBuildingSchema;

@Component({
	selector:    'sf-item-icon',
	templateUrl: './ItemIconComponent.html'
})
export class ItemIconComponent implements OnChanges{
	@Input() item: AcceptableType = null;
	@Input() size: number = 64;
	icon$: Observable<ISelectableIcon>;

	private itemChange$ = new BehaviorSubject<AcceptableType>(this.item);

	constructor() {
		const data = new Data();
		this.icon$ = this.itemChange$.pipe(
			withLatestFrom(
				of(Object.values(data.getAllBuildings())),
				of(Object.values(data.getAllItems())),
				of(data.getResources()),
			),
			map(([name, buildings, items, resources]) => {
				return []
					.concat(buildings.map(b => [name, b]))
					.concat(items.map(b => [name, b]))
					.concat(resources.map(b => [name, b]))
					;
			}),
			concatMap(x => x),
			filter((element: [AcceptableType, AcceptableType]) => element[1].className === element[0].className),
			map(e => {
				return {
					address: `/assets/images/items/${e[1].slug}_${this.getSize()}.png`,
					name:    e[1].name,
					size:    this.size
				};
			})
		);
	}

	private getSize(): number {
		if (this.size <= 64) {
			return 64;
		}

		return 256;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (!changes.item) {
			return;
		}

		if (changes.item.previousValue === changes.item.currentValue) {
			return;
		}

		this.itemChange$.next(changes.item.currentValue);
	}
}
