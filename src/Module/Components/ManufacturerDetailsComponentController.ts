import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import data from '@src/Data/Data';
import {ComponentOptionsService} from '@src/Module/Services/ComponentOptionsService';
import {Numbers} from '@src/Utils/Numbers';

export class ManufacturerDetailsComponentController
{

	public building: IBuildingSchema;
	public static $inject = ['ComponentOptionsService'];

	public constructor(public options: ComponentOptionsService)
	{

	}

	public get powerConsumption(): number|undefined
	{
		if (this.building.metadata.powerConsumption && this.building.metadata.powerConsumptionExponent) {
			return Numbers.round(this.building.metadata.powerConsumption * Math.pow(this.options.overclock / 100, this.building.metadata.powerConsumptionExponent));
		}
		return 0;
	}

	public get minPowerConsumption(): number|undefined
	{
		if (this.building.metadata.minPowerConsumption && this.building.metadata.powerConsumptionExponent) {
			return Numbers.round(this.building.metadata.minPowerConsumption * Math.pow(this.options.overclock / 100, this.building.metadata.powerConsumptionExponent));
		}
	}

	public get maxPowerConsumption(): number|undefined
	{
		if (this.building.metadata.maxPowerConsumption && this.building.metadata.powerConsumptionExponent) {
			return Numbers.round(this.building.metadata.maxPowerConsumption * Math.pow(this.options.overclock / 100, this.building.metadata.powerConsumptionExponent));
		}
	}

	public get manufacturingSpeed(): number|undefined
	{
		if (this.building.metadata.manufacturingSpeed) {
			return Numbers.round(this.building.metadata.manufacturingSpeed * (this.options.overclock / 100));
		}
	}

	public isAutonomousManufacturer(entity: any): boolean
	{
		return data.isManufacturerBuilding(entity) && !data.isManualManufacturer(entity);
	}

}
