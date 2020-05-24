import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import data from '@src/Data/Data';
import {IGeneratorSchema} from '@src/Schema/IGeneratorSchema';

export class ManufacturerDetailsComponentController
{
	public building: IBuildingSchema;

	public isAutonomousManufacturer(entity: any): boolean
	{
		return data.isManufacturerBuilding(entity) && !data.isManualManufacturer(entity);
	}
}
