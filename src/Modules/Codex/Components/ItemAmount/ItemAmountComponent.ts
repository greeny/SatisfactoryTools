import {Component, Input}  from '@angular/core';
import {ItemsDataProvider} from '@modules/Codex/Service/DataProvider';
import {IItemSchema}       from '@src/Schema/IItemSchema';
import {Observable}        from 'rxjs';
import {concatMap, filter} from 'rxjs/operators';

@Component({
    selector:    'sf-item-amount',
    templateUrl: './ItemAmountComponent.html'
})
export class ItemAmountComponent
{
    @Input() item: string;
    @Input() amount: number;
    @Input() showTooltip: boolean = true;
    item$: Observable<IItemSchema>;

    constructor(private itemProvider: ItemsDataProvider)
    {
        this.item$ = this.itemProvider.getAll().pipe(
            concatMap(x => x),
            filter((item) => {
                return this.item === item.className;
            })
        );
    }
}
