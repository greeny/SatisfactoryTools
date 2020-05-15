import {ItemAmount} from '@src/Data/ItemAmount';

export interface IProductionToolRequest
{

	resourceMax: {[key: string]: number}; // raw resource limit
	resourceWeight: {[key: string]: number}; // weighted values

	blockedResources: string[]; // whether the raw resource is available for usage or not
	blockedRecipes: string[]; // whether normal recipe can be used
	allowedAlternateRecipes: string[]; // whether alt is available or not (doesn't guarantee usage)

	production: ItemAmount[];

}
