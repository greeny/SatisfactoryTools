import {Route}                                                   from '@angular/router';
import {BuildingsComponent, ItemsComponent, SchematicsComponent} from '@modules/Codex/Components';

export const routes: Route[] = [
	{
		path:     'codex',
		data: {
			breadcrumbs: 'Codex',
			path: '',
		},
		children: [
			{
				path: 'buildings',
				data: {
					breadcrumbs: 'Buildings browser'
				},
				children: [
					{
						path: '',
						component: BuildingsComponent
					}
				]
			},
			{
				path: 'items',
				data: {
					breadcrumbs: 'Items browser'
				},
				children: [
					{
						path: '',
						component: ItemsComponent
					}
				]
			},
			{
				path: 'schematics',
				data: {
					breadcrumbs: 'Schematics browser'
				},
				children: [
					{
						path: '',
						component: SchematicsComponent
					}
				]
			}
		]
	}
];
