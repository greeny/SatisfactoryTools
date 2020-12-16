import {Route} from '@angular/router';
import {
    BuildingsComponent,
    BuildingsShowComponent,
    ItemsComponent,
    ItemsShowComponent,
    SchematicsComponent
} from '@modules/Codex/Components';
import {BuildingBreadcrumbsResolver} from '@modules/Codex/Resolver/BuildingBreadcrumbsResolver';
import {BuildingResolver} from '@modules/Codex/Resolver/BuildingResolver';
import {ItemBreadcrumbsResolver} from '@modules/Codex/Resolver/ItemBreadcrumbsResolver';
import {ItemResolver} from '@modules/Codex/Resolver/ItemResolver';

export const routes: Route[] = [
    {
        path:     'codex',
        data:     {
            breadcrumbs: 'Codex',
            path:        ''
        },
        children: [
            {
                path:     'buildings',
                data:     {
                    breadcrumbs: 'Buildings browser'
                },
                children: [
                    {
                        path:      '',
                        component: BuildingsComponent
                    },
                    {
                        path:      ':id',
                        component: BuildingsShowComponent,
                        resolve:   {
                            entity: BuildingResolver
                        },
                        data:      {
                            breadcrumbs: BuildingBreadcrumbsResolver
                        }
                    }
                ]
            },
            {
                path:     'items',
                data:     {
                    breadcrumbs: 'Items browser'
                },
                children: [
                    {
                        path:      '',
                        component: ItemsComponent
                    },
                    {
                        path:      ':id',
                        component: ItemsShowComponent,
                        resolve:   {
                            entity: ItemResolver
                        },
                        data:      {
                            breadcrumbs: ItemBreadcrumbsResolver
                        }
                    }
                ]
            },
            {
                path:     'schematics',
                data:     {
                    breadcrumbs: 'Schematics browser'
                },
                children: [
                    {
                        path:      '',
                        component: SchematicsComponent
                    }
                ]
            }
        ]
    }
];
