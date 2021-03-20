import {Component, EventEmitter, Input, Output} from "@angular/core";
import {IProductionTab} from "@modules/Calculator/Model/IProductionTab";

@Component({
	templateUrl: './ProductionTabComponent.html',
	selector: 'sf-calculator-production-tab',
	styleUrls: [
		'./ProductionTabComponent.scss'
	]
})
export class ProductionTabComponent {
	@Input() productionTab: IProductionTab;
	@Output() onTabRemove: EventEmitter<any> = new EventEmitter();
	@Output() onTabClone: EventEmitter<any> = new EventEmitter();
	@Output() onTabChanged: EventEmitter<any> = new EventEmitter<any>();

	public toggle(): void {
		this.productionTab.expanded = !this.productionTab.expanded;
	}

	public onProductionTabChanged(tab: IProductionTab): void {
		this.onTabChanged.emit();
	}
}
