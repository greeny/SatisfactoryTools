import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import data from '@src/Data/Data';

export class ManufacturerDetailsComponentController
{

	public building: IBuildingSchema;
	public overclock: number = 100;

	public get powerConsumption(): number|undefined
	{
		if (this.building.metadata.powerConsumption && this.building.metadata.powerConsumptionExponent) {
			return this.building.metadata.powerConsumption * Math.pow(this.overclock / 100, this.building.metadata.powerConsumptionExponent);
		}
	}

	public get manufacturingSpeed(): number|undefined
	{
		if (this.building.metadata.manufacturingSpeed) {
			return this.building.metadata.manufacturingSpeed * (this.overclock / 100);
		}
	}

	public isAutonomousManufacturer(entity: any): boolean
	{
		return data.isManufacturerBuilding(entity) && !data.isManualManufacturer(entity);
	}

}
