import {NgModule} from "@angular/core";
import {SharedModule} from "@modules/Shared";
import {NavigationModule} from "@modules/Navigation";
import {RouterModule} from "@angular/router";
import {navigation} from "@modules/Calculator/navigation";
import {routes} from "@modules/Calculator/routes";
import {
	IndexComponent,
	ProductionTabComponent,
	SectionInputsComponent,
	SectionProductionComponent
} from "@modules/Calculator/Components";
import {ProductionPersistentStorage} from "@modules/Calculator/Service/ProductionPersistentStorage";

@NgModule({
	declarations: [
		IndexComponent,
		ProductionTabComponent,
		SectionProductionComponent,
		SectionInputsComponent
	],
	imports: [
		SharedModule,
		NavigationModule.forChild(navigation),
		RouterModule.forChild(routes)
	],
	providers: [
		ProductionPersistentStorage
	]
})
export class CalculatorModule {
}
