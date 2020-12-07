import {Injectable}     from '@angular/core';
import {DataService}    from '@modules/Codex/Service';
import {IItemSchema}    from '@src/Schema/IItemSchema';
import {Observable, of} from 'rxjs';

@Injectable()
export class ItemsDataProvider {
	constructor(private dataService: DataService) {
	}

	public getAll(): Observable<IItemSchema[]> {
		return of(
			Object.values(this.dataService.getData().getAllItems())
		);
	}
}
