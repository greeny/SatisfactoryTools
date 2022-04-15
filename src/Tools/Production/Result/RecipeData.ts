import {IManufacturerSchema} from '@src/Schema/IBuildingSchema';
import {IAnyRecipeSchema} from '@src/Schema/IRecipeSchema';

export class RecipeData
{

	public constructor(public readonly machine: IManufacturerSchema, public readonly recipe: IAnyRecipeSchema, public readonly amount: number, public readonly clockSpeed: number)
	{

	}

}
