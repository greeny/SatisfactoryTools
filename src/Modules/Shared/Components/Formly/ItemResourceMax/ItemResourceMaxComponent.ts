import {FormlyFieldInput} from "@ngx-formly/bootstrap";
import {Component} from "@angular/core";
import {ItemsDataProvider} from "@modules/Codex/Service/DataProvider";
import {IItemSchema} from "@src/Schema/IItemSchema";

@Component({
	selector: 'formly-resource-max',
	templateUrl: './ItemResourceMaxComponent.html'
})
export class ItemResourceMaxComponent extends FormlyFieldInput {
	constructor(private dataProvider: ItemsDataProvider) {
		super();
	}

	public getItem(id: any): IItemSchema {
		return this.dataProvider.getByClassName(id);
	}
}
