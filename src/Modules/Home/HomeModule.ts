import {NgModule}         from '@angular/core';
import {RouterModule}     from '@angular/router';
import {IndexComponent}   from '@modules/Home/Components';
import {navigation}       from '@modules/Home/navigation';
import {routes}           from '@modules/Home/routes';
import {NavigationModule} from '@modules/Navigation';
import {SharedModule}     from '@modules/Shared';

@NgModule({
	declarations: [
		IndexComponent,
	],
	imports: [
		SharedModule,
		RouterModule.forChild(routes),
		NavigationModule.forChild(navigation)
	]
})
export class HomeModule {
}
