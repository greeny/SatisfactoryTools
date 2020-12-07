import {NgModule}                                                         from '@angular/core';
import {RouterModule}                                                     from '@angular/router';
import {BuildingsComponent, ItemsComponent, SchematicsComponent}          from '@modules/Codex/Components';
import {navigation}                                                       from '@modules/Codex/navigation';
import {routes}                                                           from '@modules/Codex/routes';
import {DataService}                                                      from '@modules/Codex/Service';
import {BuildingsDataProvider, ItemsDataProvider, SchematicsDataProvider} from '@modules/Codex/Service/DataProvider';
import {NavigationModule}                                                 from '@modules/Navigation';
import {SharedModule}                                                     from '@modules/Shared';

@NgModule({
	declarations: [
		BuildingsComponent,
		ItemsComponent,
		SchematicsComponent
	],
	imports:      [
		SharedModule,
		NavigationModule.forChild(navigation),
		RouterModule.forChild(routes)
	],
	providers:    [
		DataService,
		ItemsDataProvider,
		BuildingsDataProvider,
		SchematicsDataProvider
	]
})
export class CodexModule {
}
