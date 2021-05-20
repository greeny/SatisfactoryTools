import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {environment} from '@env/environment';
import {AppComponent} from '@src/Components/App/AppComponent';
import {AppRoutingModule} from '@src/Modules/AppRoutingModule';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        StoreModule.forRoot({}, {}),
        StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
        EffectsModule.forRoot([])
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule
{
}
