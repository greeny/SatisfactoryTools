import {Injectable}                                           from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ItemsDataProvider}                                    from '@modules/Codex/Service/DataProvider';
import {IItemSchema}                                          from '@src/Schema/IItemSchema';
import {Observable}             from 'rxjs';
import {concatMap, filter, map} from 'rxjs/operators';

@Injectable()
export class ItemResolver implements Resolve<IItemSchema> {
    constructor(private provider: ItemsDataProvider) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IItemSchema> {
        return this.provider.getAll().pipe(
            concatMap(x => x),
            filter((entry) => {
                return route.paramMap.get('id') === entry.slug
            })
        );
    }
}
