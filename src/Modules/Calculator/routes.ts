import {Route} from "@angular/router";
import {IndexComponent} from "@modules/Calculator/Components";

export const routes: Route[] = [
	{
		path: 'calculator',
		data: {
			breadcrumbs: 'Production',
			path: ''
		},
		component: IndexComponent,
		children: [
		]
	}
];
