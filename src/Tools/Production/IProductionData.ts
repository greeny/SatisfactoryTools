export interface IProductionData
{

	metadata: IProductionDataMetadata;
	request: IProductionDataRequest;

}

export interface IProductionDataMetadata
{

	name: string|null;
	icon: string|null;
	schemaVersion: number;
	gameVersion: string;

}

export interface IProductionDataRequest
{

	resourceMax: {[key: string]: number}; // raw resource limit
	resourceWeightType: string;
	resourceWeight: {[key: string]: number}; // weighted values

	blockedResources: string[]; // whether the raw resource is available for usage or not
	blockedRecipes: string[]; // whether normal recipe can be used
	allowedAlternateRecipes: string[]; // whether alt is available or not (doesn't guarantee usage)

	sinkableResources: string[]; // whether you can sink a given resource

	production: IProductionDataRequestItem[];
	input: IProductionDataRequestInput[];

	defaultClockSpeed: number; // default clock speed to use
	clockSpeeds: IProductionDataClockSpeed[]; // clock speeds per recipe
	generators: IProductionDataGenerator[]; // enabled generators and fuels
	blockedByproducts: string[]; // classnames of items that can't be left as byproduct
	optimisation: string;

}

export interface IProductionDataApiRequest extends IProductionDataRequest
{

	gameVersion: string;

}

export interface IProductionDataRequestItem
{

	item: string|null; // classname of the item
	type: string; // Constants.PRODUCTION_TYPE
	amount: number; // amount when producing items/min
	ratio: number; // ratio when producing max

}

export interface IProductionDataRequestInput
{

	item: string|null; // classname of the item
	amount: number; // amount of items/min

}

export interface IProductionDataClockSpeed
{

	recipe: string|null; // recipe class
	clockSpeed: number; // clock speed for given recipe

}

export interface IProductionDataGenerator
{

	generator: string; // generator class
	fuel: string; // fuel class

}

export interface IProductionDataApiResponse
{

	[key: string]: number;

}
