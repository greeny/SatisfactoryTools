import {Component} from "@angular/core";
import {FieldArrayType} from "@ngx-formly/core";
import {Objects} from "@utils/Objects";

@Component({
	selector: 'formly-repeat-section',
	templateUrl: './RepeatTypeComponent.html'
})
export class RepeatTypeComponent extends FieldArrayType {
	clone(i: number, markAsDirty: boolean = true): void {
		this.add(this.model.length, Objects.deepCopy(this.model[i]), {markAsDirty: true});
	}

	clear(): void {
		if (0 === this.model.length) {
			return;
		}
		this.remove(0);
		this.clear();
	}
}
