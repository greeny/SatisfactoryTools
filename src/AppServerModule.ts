import {NgModule} from '@angular/core';
import {ServerModule} from '@angular/platform-server';

import {RootComponent} from '@src/Components/RootComponent';
import {AppModule} from '@src/AppModule';

@NgModule({
	imports: [
		AppModule,
		ServerModule,
	],
	bootstrap: [RootComponent],
})
export class AppServerModule
{
}
