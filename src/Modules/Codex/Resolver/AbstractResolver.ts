import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {CODEX_TYPES} from '@src/Constants';
import {IDataProvider} from '@src/Types/IDataProvider';
import {identity, Observable} from 'rxjs';
import {concatMap, filter} from 'rxjs/operators';

export abstract class AbstractResolver<T extends CODEX_TYPES> implements Resolve<T>
{
	protected constructor(protected provider: IDataProvider<T>)
	{
	}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T>
	{
		return this.provider.getAll().pipe(
			concatMap(identity),
			filter((entry) => {
				return route.paramMap.get('id') === entry.slug;
			})
		);
	}
}
