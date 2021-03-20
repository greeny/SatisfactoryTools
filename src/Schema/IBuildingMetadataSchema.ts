export interface IBuildingMetadataSchema
{

	beltSpeed?: number;
	firstPieceCostMultiplier?: number;
	lengthPerCost?: number;
	maxLength?: number;
	storageSize?: number;
	powerConsumption?: number;
	powerConsumptionExponent?: number;
	manufacturingSpeed?: number;
	inventorySize?: number;
	flowLimit?: number;
	maxPressure?: number;
	storageCapacity?: number;

}

export interface IManufacturerMetadataSchema extends IBuildingMetadataSchema
{

	powerConsumption: number;
	powerConsumptionExponent: number;
	manufacturingSpeed: number;

}
