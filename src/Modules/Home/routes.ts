import {Route}          from '@angular/router';
import {IndexComponent} from '@modules/Home/Components';

export const routes: Route[] = [
	{
		path: '',
		component: IndexComponent,
		data: {
			breadcrumbs: 'Satisfactory Tools'
		}
	}
];
