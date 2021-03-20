import {Injectable} from '@angular/core';
import {DataService} from '@modules/Codex/Service';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {IDataProvider} from '@src/Types/IDataProvider';
import {Observable, of} from 'rxjs';

@Injectable()
export class BuildingsDataProvider implements IDataProvider<IBuildingSchema>
{

	constructor(private dataService: DataService)
	{
	}

	public getAll(): Observable<(IBuildingSchema)[]>
	{
		return of(
			Object.values(this.dataService.getData().getAllBuildings())
		);
	}
}
