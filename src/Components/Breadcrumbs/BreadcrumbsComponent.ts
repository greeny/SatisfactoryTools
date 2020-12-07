import {Component}          from '@angular/core';
import {Router}             from '@angular/router';
import {BreadcrumbsService} from '@exalif/ngx-breadcrumbs';
import {Breadcrumb}         from '@exalif/ngx-breadcrumbs/lib/models/breadcrumb';
import {Observable}         from 'rxjs';

@Component({
	selector:    'sf-breadcrumbs',
	templateUrl: './BreadcrumbsComponent.html'
})
export class BreadcrumbsComponent {
	breadcrumbs: Observable<Breadcrumb[]>;

	constructor(private breadcrumbsService: BreadcrumbsService, private router: Router) {
		this.breadcrumbs = this.breadcrumbsService.getCrumbs();
	}

	isActive(path: string, exact: boolean): boolean {
		return this.router.isActive(path, exact);
	}
}
