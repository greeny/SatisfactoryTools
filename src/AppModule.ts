import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TabsModule} from 'ngx-bootstrap/tabs';

import {RouterModule} from '@angular/router';
import {RootComponent} from '@src/Components/RootComponent';
import {NavigationComponent} from '@src/Components/NavigationComponent';
import {ItemIconComponent} from '@src/Components/ItemIconComponent';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {IndexComponent} from '@src/Components/Page/IndexComponent';
import {CalculatorComponent} from '@src/Components/Page/CalculatorComponent';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from 'configuration/environments/environment';
import {StoreModule} from '@ngrx/store';
import {reducers} from '@src/Store';
import {EffectsModule} from '@ngrx/effects';
import {HttpClientModule} from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';


import {RootEffects} from '@src/Store/RootEffects';
import {BuildingEffects} from '@src/Store/BuildingEffects';
import {ItemEffects} from '@src/Store/ItemEffects';
import {RecipeEffects} from '@src/Store/RecipeEffects';
import {ResourceEffects} from '@src/Store/ResourceEffects';
import {MinerEffects} from '@src/Store/MinerEffects';
import {SchematicEffects} from '@src/Store/SchematicEffects';
import {GeneratorEffects} from '@src/Store/GeneratorEffects';
import {CalculatorEffects} from '@src/Store/CalculatorEffects';

@NgModule({
	declarations: [
		RootComponent,
		NavigationComponent,
		ItemIconComponent,
		IndexComponent,
		CalculatorComponent,
	],
	imports: [
		CommonModule,
		BrowserModule.withServerTransition({appId: 'serverApp'}),
		HttpClientModule,
		BrowserAnimationsModule,
		BsDropdownModule.forRoot(),
		TabsModule.forRoot(),
		TooltipModule.forRoot(),
		PerfectScrollbarModule,
		StoreModule.forRoot(reducers, {
			runtimeChecks: {
				strictStateImmutability: true,
				strictActionImmutability: true
			}
		}),
		StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
		EffectsModule.forRoot([
			RootEffects,
			BuildingEffects,
			ItemEffects,
			RecipeEffects,
			ResourceEffects,
			MinerEffects,
			SchematicEffects,
			GeneratorEffects,
			CalculatorEffects
		]),
		RouterModule.forRoot(
			[
				{
					path: '',
					component: IndexComponent
				},
				{
					path: 'production',
					component: CalculatorComponent
				},

				{
					path: '**',
					redirectTo: ''
				}
			],
			{
				initialNavigation: 'enabled'
			}
		)
	],
	providers: [],
	bootstrap: [RootComponent]
})
export class AppModule
{
}
