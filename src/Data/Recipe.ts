import {Model} from '@src/Data/Model';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {ItemAmount} from '@src/Data/ItemAmount';
import {IManufacturerSchema} from '@src/Schema/IBuildingSchema';
import data from '@src/Data/Data';

export class Recipe
{

	public readonly ingredients: ItemAmount[] = [];
	public readonly products: ItemAmount[] = [];
	public readonly machine: IManufacturerSchema;

	public constructor(private readonly model: Model, public readonly prototype: IRecipeSchema)
	{
		for (const ingredient of prototype.ingredients) {
			this.ingredients.push(new ItemAmount(model.getItem(ingredient.item), ingredient.amount));
		}
		for (const product of prototype.products) {
			this.products.push(new ItemAmount(model.getItem(product.item), product.amount));
		}
		if (prototype.producedIn.length) {
			const machine = data.getManufacturerByClassName(prototype.producedIn[0]);
			if (machine) {
				this.machine = machine;
			}
		}
	}

}
