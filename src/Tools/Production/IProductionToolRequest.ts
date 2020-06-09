export interface IProductionToolRequest
{

	name: string|null;
	icon: string|null;

	resourceMax: {[key: string]: number}; // raw resource limit
	resourceWeight: {[key: string]: number}; // weighted values

	blockedResources: string[]; // whether the raw resource is available for usage or not
	blockedRecipes: string[]; // whether normal recipe can be used
	allowedAlternateRecipes: string[]; // whether alt is available or not (doesn't guarantee usage)

	production: IProductionToolRequestItem[];

}

export interface IProductionToolRequestItem
{

	item: string|null; // classname of the item
	type: string; // Constants.PRODUCTION_TYPE
	amount: number; // amount when producing items/min
	ratio: number; // ratio when producing max

}
