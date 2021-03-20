import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {IProductionTab} from "@modules/Calculator/Model/IProductionTab";
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig, FormlyFormOptions} from "@ngx-formly/core";
import {Constants} from "@src/Constants";
import {ItemsDataProvider} from "@modules/Codex/Service/DataProvider";
import {Subscription} from "rxjs";
import {debounce, debounceTime} from "rxjs/operators";

@Component({
	selector: 'production-section-production',
	templateUrl: 'SectionProductionComponent.html'
})
export class SectionProductionComponent implements OnInit, OnDestroy {
	@Input() productionTab: IProductionTab;
	@Output() onTabChanged: EventEmitter<IProductionTab> = new EventEmitter<IProductionTab>();
	private subscription: Subscription;

	form: FormGroup = new FormGroup({});
	fields: FormlyFieldConfig[] = [
		{
			key: 'productionToolRequest.production',
			type: 'repeat',
			fieldArray: {
				fieldGroupClassName: 'd-flex flex-row',
				fieldGroup: [
					{
						className: 'flex-fill-fx',
						key: 'item',
						type: 'item-select',
						templateOptions: {
							required: true,
							options: this.itemsProvider.getAllArray(),
							virtualScroll: true,
							itemSize: 20
						}
					},
					{
						className: 'flex-fill-fx',
						key: 'type',
						type: 'select',
						defaultValue: Constants.PRODUCTION_TYPE.PER_MINUTE,
						templateOptions: {
							required: true,
							options: [
								{label: 'items/min', value: Constants.PRODUCTION_TYPE.PER_MINUTE},
								{label: 'maximize', value: Constants.PRODUCTION_TYPE.MAXIMIZE},
							]
						}
					},
					{
						className: 'flex-fill-fx',
						key: 'amount',
						type: 'input',
						defaultValue: 10,
						expressionProperties: {
							'templateOptions.required': `model.type === '${Constants.PRODUCTION_TYPE.PER_MINUTE}'`,
						},
						hideExpression: `model.type !== '${Constants.PRODUCTION_TYPE.PER_MINUTE}'`,
						templateOptions: {
							required: true,
							type: 'number',
							min: 0,
							step: 1,
						}
					},
					{
						className: 'flex-fill-fx',
						key: 'ratio',
						type: 'input',
						defaultValue: 10,
						hideExpression: `model.type !== '${Constants.PRODUCTION_TYPE.MAXIMIZE}'`,
						expressionProperties: {
							'templateOptions.required': `model.type === '${Constants.PRODUCTION_TYPE.MAXIMIZE}'`,
						},
						templateOptions: {
							required: true,
							type: 'range',
							min: 0,
							max: 100,
							step: 1,
						}
					},
				]
			},
			templateOptions: {
				clone: true
			}
		}
	];
	options: FormlyFormOptions = {}

	constructor(private itemsProvider: ItemsDataProvider) {
	}

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
}
