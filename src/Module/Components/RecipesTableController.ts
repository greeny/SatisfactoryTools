import {IOnInit} from 'angular';
import {IItemSchema} from '@src/Schema/IItemSchema';
import data from '@src/Data/Data';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {IBuildingSchema, IManufacturerSchema} from '@src/Schema/IBuildingSchema';

export class RecipesTableController implements IOnInit
{
	public static $inject = [];

	public constructor()
	{
	}

	public getItem(className: string): IItemSchema|null
	{
		return data.getRawData().items[className];
	}

	public getRecipe(className: string): IRecipeSchema|null
	{
		return data.getRawData().recipes[className];
	}

	public getBuilding(className: string): IBuildingSchema|null
	{
		return data.getRawData().buildings[className];
	}

	public getMachine(recipe: IRecipeSchema): IManufacturerSchema|null
	{
		return data.getManufacturerByClassName(recipe.producedIn[0]);
	}

	public $onInit(): void
	{
	}
}
