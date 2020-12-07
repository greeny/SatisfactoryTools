import {Injectable}       from '@angular/core';
import {DataService}      from '@modules/Codex/Service';
import {IBuildingSchema}  from '@src/Schema/IBuildingSchema';
import {ISchematicSchema} from '@src/Schema/ISchematicSchema';
import {Observable, of}   from 'rxjs';

@Injectable()
export class SchematicsDataProvider {

	constructor(private dataService: DataService) {
	}

	public getAll(): Observable<ISchematicSchema[]> {
		return of(
			Object.values(this.dataService.getData().getAllSchematics())
		);
	}
}
