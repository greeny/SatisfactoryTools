import {Injectable} from '@angular/core';
import {DataService} from '@modules/Codex/Service';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {ISchematicSchema} from '@src/Schema/ISchematicSchema';
import {IDataProvider} from '@src/Types/IDataProvider';
import {Observable, of} from 'rxjs';

@Injectable()
export class SchematicsDataProvider implements IDataProvider<ISchematicSchema>
{

	constructor(private dataService: DataService)
	{
	}

	public getAll(): Observable<ISchematicSchema[]>
	{
		return of(
			Object.values(this.dataService.getData().getAllSchematics())
		);
	}
}
