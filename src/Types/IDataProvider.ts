import {CODEX_TYPES} from '@src/Constants';
import {Observable} from 'rxjs';

export interface IDataProvider<T extends CODEX_TYPES>
{
	getAll(): Observable<T[]>;
}
