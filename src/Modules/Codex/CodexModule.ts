import {NgModule}                                                                    from '@angular/core';
import {RouterModule}                                                                from '@angular/router';
import {
	BuildingRendererComponent,
	BuildingsComponent, ItemAmountComponent,
	ItemsComponent,
	ItemsShowComponent,
	RecipesTableComponent,
	SchematicsComponent
} from '@modules/Codex/Components';
import {navigation}                                                                  from '@modules/Codex/navigation';
import {ItemBreadcrumbsResolver}                                                     from '@modules/Codex/Resolver/ItemBreadcrumbsResolver';
import {ItemResolver}                                                                from '@modules/Codex/Resolver/ItemResolver';
import {routes}                                                                      from '@modules/Codex/routes';
import {DataService}                                                                 from '@modules/Codex/Service';
import {
	BuildingsDataProvider,
	ItemsDataProvider,
	RecipesDataProvider,
	SchematicsDataProvider
} from '@modules/Codex/Service/DataProvider';
import {NavigationModule}                                                            from '@modules/Navigation';
import {SharedModule}                                                                from '@modules/Shared';

@NgModule({
	declarations: [
		BuildingsComponent,
		ItemsComponent,
		ItemsShowComponent,
		ItemAmountComponent,
		SchematicsComponent,
		RecipesTableComponent,
		BuildingRendererComponent
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
		SchematicsDataProvider,
		RecipesDataProvider,
		ItemResolver,
		ItemBreadcrumbsResolver
	]
})
export class CodexModule {
}
