import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BreadcrumbsConfig, BreadcrumbsModule} from '@exalif/ngx-breadcrumbs';
import {Breadcrumb} from '@exalif/ngx-breadcrumbs/lib/models/breadcrumb';
import {CodexModule} from '@modules/Codex';
import {CommunityModule} from '@modules/Community';
import {HomeModule} from '@modules/Home';
import {NavigationModule} from '@modules/Navigation';
import {RootModule} from '@modules/RootModule';
import {SharedModule} from '@modules/Shared';
import {BreadcrumbsComponent, RootComponent} from './Components';
import {CalculatorModule} from "@modules/Calculator";

@NgModule({
    declarations: [
        RootComponent,
        BreadcrumbsComponent
    ],
    imports:      [
        SharedModule,
        NavigationModule.forRoot([]),
        RouterModule.forRoot([]),
        BreadcrumbsModule.forRoot(),
        CodexModule,
        RootModule,
        HomeModule,
		CalculatorModule,
        CommunityModule
    ],
    providers:    [],
    bootstrap:    [RootComponent]
})
export class AppModule {
    constructor(breadcrumbsConfig: BreadcrumbsConfig) {

        breadcrumbsConfig.postProcess = (breadcrumbs): Breadcrumb[] => {
            let processedBreadcrumbs = breadcrumbs;
            if (breadcrumbs.length && breadcrumbs[0].text !== 'Satisfactory Tools') {
                processedBreadcrumbs = [
                    {
                        text: 'Satisfactory Tools',
                        path: ''
                    }
                ].concat(breadcrumbs);
            }

            return processedBreadcrumbs;
        };
    }
}
