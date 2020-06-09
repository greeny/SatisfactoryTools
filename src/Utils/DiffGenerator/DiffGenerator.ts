import {IJsonSchema} from '@src/Schema/IJsonSchema';
import {IDiffSchema} from '@src/Utils/DiffGenerator/IDiffSchema';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {IItemAmountSchema} from '@src/Schema/IItemAmountSchema';

export class DiffGenerator
{

	private diff: IDiffSchema[] = [];

	private originalSchema: IJsonSchema;
	private newSchema: IJsonSchema;

	public generateDiff(originalSchema: IJsonSchema, newSchema: IJsonSchema): IDiffSchema[]
	{
		this.diff = [];

		this.originalSchema = originalSchema;
		this.newSchema = newSchema;

		for (const key in originalSchema.items) {
			this.checkForRemoved(originalSchema.items[key], newSchema.items[key], originalSchema.items[key].name, 'item');
		}
		for (const key in originalSchema.recipes) {
			this.checkForRemoved(originalSchema.recipes[key], newSchema.recipes[key], originalSchema.recipes[key].name, 'recipe');
		}

		for (const key in newSchema.items) {
			this.checkForAdded(originalSchema.items[key], newSchema.items[key], newSchema.items[key].name, 'item');
		}
		for (const key in newSchema.recipes) {
			this.checkForAdded(originalSchema.recipes[key], newSchema.recipes[key], newSchema.recipes[key].name, 'recipe');
		}

		for (const key in originalSchema.items) {
			this.checkItemChanges(originalSchema.items[key], newSchema.items[key]);
		}

		for (const key in originalSchema.recipes) {
			this.checkRecipeChanges(originalSchema.recipes[key], newSchema.recipes[key]);
		}

		return this.diff;
	}

	private checkForRemoved(originalItem: any, newItem: any, name: string, type: string): void
	{
		if (originalItem && !newItem) {
			this.diff.push({
				name: null,
				changes: [
					'Removed ' + type + ': ' + name,
				],
			});
		}
	}

	private checkForAdded(originalItem: any, newItem: any, name: string, type: string): void
	{
		if (!originalItem && newItem) {
			this.diff.push({
				name: null,
				changes: [
					'Added new ' + type + ': ' + name,
				],
			});
		}
	}

	private checkItemChanges(originalItem: IItemSchema|undefined, newItem: IItemSchema|undefined): void
	{
		if (!originalItem || !newItem) {
			return;
		}

		const changes: string[] = [];

		if (originalItem.name !== newItem.name) {
			changes.push('Renamed to ' + newItem.name);
		}

		if (originalItem.sinkPoints !== newItem.sinkPoints) {
			changes.push('Changed sink point value from ' + originalItem.sinkPoints + ' to ' + newItem.sinkPoints);
		}

		if (originalItem.energyValue !== newItem.energyValue) {
			changes.push('Changed energy value from ' + originalItem.energyValue + ' to ' + newItem.energyValue);
		}

		if (originalItem.stackSize !== newItem.stackSize) {
			changes.push('Changed stack size from ' + originalItem.stackSize + ' to ' + newItem.stackSize);
		}

		if (originalItem.radioactiveDecay !== newItem.radioactiveDecay) {
			changes.push('Changed radioactive decay from ' + originalItem.radioactiveDecay + ' to ' + newItem.radioactiveDecay);
		}

		if (changes.length) {
			this.diff.push({
				name: originalItem.name,
				changes: changes,
			});
		}
	}

	private checkRecipeChanges(originalRecipe: IRecipeSchema|undefined, newRecipe: IRecipeSchema|undefined): void
	{
		if (!originalRecipe || !newRecipe) {
			return;
		}

		const changes: string[] = [];

		if (originalRecipe.name !== newRecipe.name) {
			changes.push('Renamed to ' + newRecipe.name);
		}

		if (originalRecipe.inHand !== newRecipe.inHand) {
			changes.push((newRecipe.inHand ? 'Allowed' : 'Disallowed') + ' handcrafting.');
		}

		if (originalRecipe.inWorkshop !== newRecipe.inWorkshop) {
			changes.push((newRecipe.inWorkshop ? 'Allowed' : 'Disallowed') + ' crafting in workshop.');
		}

		if (originalRecipe.time !== newRecipe.time) {
			changes.push('Changed recipe craft time from ' + originalRecipe.time + ' to ' + newRecipe.time + ' seconds');
		}

		for (const k in (originalRecipe.ingredients.length > newRecipe.ingredients.length ? originalRecipe.ingredients : newRecipe.ingredients)) {
			const change = this.checkRecipeIngredient(originalRecipe.ingredients[k], newRecipe.ingredients[k], 'cost');
			if (change !== null) {
				changes.push(change);
			}
		}

		if (!newRecipe.forBuilding) {
			for (const k in (originalRecipe.products.length > newRecipe.products.length ? originalRecipe.products : newRecipe.products)) {
				const change = this.checkRecipeIngredient(originalRecipe.products[k], newRecipe.products[k], 'product');
				if (change !== null) {
					changes.push(change);
				}
			}
		}

		if (changes.length) {
			this.diff.push({
				name: originalRecipe.name,
				changes: changes,
			});
		}
	}

	private checkRecipeIngredient(originalIngredient: IItemAmountSchema|undefined, newIngredient: IItemAmountSchema|undefined, type: string): string|null
	{
		if (!originalIngredient && !newIngredient) {
			return null;
		}

		if (!newIngredient) {
			return 'Removed ' + this.originalSchema.items[(originalIngredient as IItemAmountSchema).item].name + ' ' + type;
		}

		if (!originalIngredient) {
			return 'Added ' + newIngredient.amount + ' ' + this.newSchema.items[newIngredient.item].name + ' ' + type;
		}

		if (originalIngredient.item !== newIngredient.item) {
			return 'Replaced ' + originalIngredient.amount + ' ' + this.originalSchema.items[originalIngredient.item].name + ' ' + type
				+ ' with ' + newIngredient.amount + ' ' + this.newSchema.items[newIngredient.item].name;
		} else if (originalIngredient.amount !== newIngredient.amount) {
			return 'Changed ' + this.originalSchema.items[originalIngredient.item].name + ' ' + type + ' from ' + originalIngredient.amount + ' to ' + newIngredient.amount;
		}

		return null;
	}


}
