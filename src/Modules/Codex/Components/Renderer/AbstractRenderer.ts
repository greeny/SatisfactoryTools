import {CODEX_TYPES} from '@src/Constants';
import {IDataProvider} from '@src/Types/IDataProvider';
import {Observable} from 'rxjs';
import {concatMap, filter} from 'rxjs/operators';

export abstract class AbstractRenderer<T extends CODEX_TYPES>
{
	abstract item: string;
	abstract showName: boolean = true;
	abstract showTooltip: boolean = true;
	public readonly item$: Observable<T>;

	protected constructor(protected buildingProvider: IDataProvider<T>)
	{
		this.item$ = this.buildingProvider.getAll().pipe(
			concatMap(x => x),
			filter((building) => {
				return this.item === building.className;
			})
		);
	}
}
