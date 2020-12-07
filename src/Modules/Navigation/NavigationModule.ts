import {ModuleWithProviders, NgModule}          from '@angular/core';
import {RouterModule}                           from '@angular/router';
import {NAVIGATION_CONFIG, NavigationComponent} from '@modules/Navigation/Components';
import {NavigationRoot}                         from '@modules/Navigation/Model';
import {SharedModule}                           from '@modules/Shared';

@NgModule({
    declarations: [
        NavigationComponent
    ],
    imports:      [
        SharedModule,
        RouterModule.forChild([])
    ],
    exports:      [
        NavigationComponent
    ]
})
export class NavigationModule {
    static forRoot(links: NavigationRoot[] = []): ModuleWithProviders<NavigationModule> {
        return {
            ngModule:  NavigationModule,
            providers: [
                links.map((link: NavigationRoot) => {
                    return {provide: NAVIGATION_CONFIG, multi: true, useValue: link};
                })
            ]
        };
    }

    static forChild(links: NavigationRoot[] = []): ModuleWithProviders<NavigationModule> {
        return {
            ngModule:  NavigationModule,
            providers: [
                links.map((link: NavigationRoot) => {
                    return {provide: NAVIGATION_CONFIG, multi: true, useValue: link};
                })
            ]
        };
    }
}
