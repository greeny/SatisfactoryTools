import {Injectable}                                  from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {BreadcrumbsResolver}                         from '@exalif/ngx-breadcrumbs';
import {ItemsDataProvider}                           from '@modules/Codex/Service/DataProvider';
import {Observable}                                  from 'rxjs';
import {concatMap, filter, map}                      from 'rxjs/operators';

@Injectable()
export class ItemBreadcrumbsResolver extends BreadcrumbsResolver {
    constructor(private provider: ItemsDataProvider) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
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
