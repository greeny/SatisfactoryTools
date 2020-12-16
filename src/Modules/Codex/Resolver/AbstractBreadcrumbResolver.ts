import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {BreadcrumbsResolver} from '@exalif/ngx-breadcrumbs';
import {Breadcrumb} from '@exalif/ngx-breadcrumbs/lib/models/breadcrumb';
import {CODEX_TYPES} from '@src/Constants';
import {IDataProvider} from '@src/Types/IDataProvider';
import {Observable} from 'rxjs';
import {concatMap, filter, map} from 'rxjs/operators';

export abstract class AbstractBreadcrumbResolver<T extends CODEX_TYPES> extends BreadcrumbsResolver
{
	protected constructor(protected provider: IDataProvider<T>)
	{
		super();
	}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Breadcrumb[]>
	{
		return this.provider.getAll().pipe(
			concatMap(x => x),
			filter((entry) => {
				return route.paramMap.get('id') === entry.slug;
			}),
			map(entry => {
				return [
					{
						text: entry.name,
						path: super.getFullPath(route.parent) + '/' + entry.slug
					}
				];
			})
		);
	}
}
