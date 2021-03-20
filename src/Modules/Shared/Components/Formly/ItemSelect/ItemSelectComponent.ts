import {FormlyFieldSelect} from "@ngx-formly/bootstrap";
import {Component, NgZone} from "@angular/core";
import {IItemSchema} from "@src/Schema/IItemSchema";
import {ItemsDataProvider} from "@modules/Codex/Service/DataProvider";

@Component({
	selector: 'formly-item-select',
	templateUrl: './ItemSelectComponent.html'
})
export class ItemSelectComponent extends FormlyFieldSelect {

	constructor(private itemProvider: ItemsDataProvider, ngZone: NgZone) {
		super(ngZone);
	}

	getItem(className: string): IItemSchema {
		return this.itemProvider.getByClassName(className);
	}
}
