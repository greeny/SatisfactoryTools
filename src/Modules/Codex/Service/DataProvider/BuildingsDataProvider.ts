import {Injectable}                  from '@angular/core';
import {DataService}                 from '@modules/Codex/Service';
import {IBuildingSchema}             from '@src/Schema/IBuildingSchema';
import {Observable, of}              from 'rxjs';

@Injectable()
export class BuildingsDataProvider {

	constructor(private dataService: DataService) {
	}

	public getAll(): Observable<(IBuildingSchema)[]> {
		return of(
			Object.values(this.dataService.getData().getAllBuildings())
		);
	}
}
