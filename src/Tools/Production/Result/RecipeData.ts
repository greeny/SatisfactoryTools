import {IManufacturerSchema} from '@src/Schema/IBuildingSchema';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';

export class RecipeData
{

	public constructor(public readonly machine: IManufacturerSchema, public readonly recipe: IRecipeSchema, public readonly amount: number, public readonly clockSpeed: number)
	{

	}

}
