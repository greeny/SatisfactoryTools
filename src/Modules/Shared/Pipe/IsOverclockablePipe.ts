import {Pipe, PipeTransform} from '@angular/core';
import {DataService} from '@modules/Codex/Service';
import {Constants} from '@src/Constants';
import {Data} from '@src/Data/Data';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';

@Pipe({
	name: 'IsOverclockable'
})
export class IsOverclockablePipe implements PipeTransform
{
	constructor(private dataService: DataService)
	{
	}

	public transform(entity: IBuildingSchema, ...args: any[]): boolean
	{
		const data: Data = this.dataService.getData();
		if (true === data.isManualManufacturer(entity)) {
			return false;
		}

		if (true === data.isManufacturerBuilding(entity) || true === data.isExtractorBuilding(entity)) {
			return true;
		}

		return true === data.isGeneratorBuilding(entity) && Constants.GEOTHERMAL_GENERATOR_CLASSNAME !== entity.className;
	}
}
