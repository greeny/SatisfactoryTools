import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {IProductionTab} from "@modules/Calculator/Model/IProductionTab";
import {Subscription} from "rxjs";
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig, FormlyFormOptions} from "@ngx-formly/core";
import {debounceTime} from "rxjs/operators";
import {Data} from "@src/Data/Data";

@Component({
	selector: 'production-section-inputs',
	templateUrl: './SectionInputsComponent.html'
})
export class SectionInputsComponent implements OnInit, OnDestroy {
	@Input() productionTab: IProductionTab;
	@Output() onTabChanged: EventEmitter<IProductionTab> = new EventEmitter<IProductionTab>();
	private subscription: Subscription;

	form: FormGroup = new FormGroup({});
	fields: FormlyFieldConfig[] = [
		{
			key: 'productionToolRequest.resourceMax',
			fieldGroup: [
				{key: 'Desc_Coal_C', type: 'resource-max'},
				{key: 'Desc_LiquidOil_C', type: 'resource-max'},
				{key: 'Desc_OreBauxite_C', type: 'resource-max'},
				{key: 'Desc_OreCopper_C', type: 'resource-max'},
				{key: 'Desc_OreGold_C', type: 'resource-max'},
				{key: 'Desc_OreIron_C', type: 'resource-max'},
				{key: 'Desc_OreUranium_C', type: 'resource-max'},
				{key: 'Desc_RawQuartz_C', type: 'resource-max'},
				{key: 'Desc_Stone_C', type: 'resource-max'},
				{key: 'Desc_Sulfur_C', type: 'resource-max'},
				{key: 'Desc_Water_C', type: 'resource-max'},
			]
		}
	];
	options: FormlyFormOptions = {};


	ngOnInit(): void {
		this.subscription = this.form
			.valueChanges
			.pipe(
				debounceTime(100)
			)
			.subscribe(v => {
				if (!this.form.valid) {
					return;
				}
				this.onTabChanged.emit(this.form.value);
			})
	}

	ngOnDestroy(): void {
		if (!this.subscription) {
			return;
		}
		this.subscription.unsubscribe();
	}

	public setDefaults(): void {
		const model = {
			...this.productionTab,
			productionToolRequest: {...this.productionTab.productionToolRequest, resourceMax: Data.resourceAmounts}
		};

		this.form.patchValue(model);
	}

	public setZero(): void {
		let productionToolRequest = this.productionTab.productionToolRequest;
		Object.keys(productionToolRequest.resourceMax).forEach(k => {
			productionToolRequest.resourceMax[k] = 0
		});
		const model = {...this.productionTab, ...productionToolRequest};

		this.form.patchValue(model);
	}
}
