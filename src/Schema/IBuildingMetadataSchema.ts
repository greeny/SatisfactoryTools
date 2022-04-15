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
	isVariablePower?: boolean;
	minPowerConsumption?: number;
	maxPowerConsumption?: number;

}

export interface IManufacturerMetadataSchema extends IBuildingMetadataSchema
{

	powerConsumption: number;
	powerConsumptionExponent: number;
	manufacturingSpeed: number;

}

export interface IManufacturerVariablePowerMetadataSchema extends IManufacturerMetadataSchema
{

	isVariablePower: true;
	minPowerConsumption: number;
	maxPowerConsumption: number;

}

export interface IManufacturerFixedPowerMetadataSchema extends IManufacturerMetadataSchema
{

	isVariablePower: true;

}

export type IManufacturerAnyPowerMetadataSchema = IManufacturerVariablePowerMetadataSchema | IManufacturerFixedPowerMetadataSchema;
