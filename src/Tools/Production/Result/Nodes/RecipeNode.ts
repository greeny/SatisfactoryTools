import {GraphNode} from '@src/Tools/Production/Result/Nodes/GraphNode';
import {RecipeData} from '@src/Tools/Production/Result/RecipeData';
import {IVisNode} from '@src/Tools/Production/Result/IVisNode';
import {IJsonSchema} from '@src/Schema/IJsonSchema';
import {ResourceAmount} from '@src/Tools/Production/Result/ResourceAmount';
import {Strings} from '@src/Utils/Strings';

export class RecipeNode extends GraphNode
{

	public ingredients: ResourceAmount[] = [];
	public products: ResourceAmount[] = [];

	public constructor(public readonly recipeData: RecipeData, data: IJsonSchema)
	{
		super();
		const multiplier = this.getMultiplier();
		for (const ingredient of recipeData.recipe.ingredients) {
			this.ingredients.push(new ResourceAmount(data.items[ingredient.item], ingredient.amount * multiplier, 0));
		}
		for (const product of recipeData.recipe.products) {
			this.products.push(new ResourceAmount(data.items[product.item], product.amount * multiplier, product.amount * multiplier));
		}
	}

	public getVisNode(): IVisNode
	{
		return {
			id: this.id,
			label: this.getLabel(),
			title: this.getTitle() as unknown as string,
			color: {
				border: 'rgba(0, 0, 0, 0)',
				background: 'rgba(223, 105, 26, 1)',
				highlight: {
					border: 'rgba(238, 238, 238, 1)',
					background: 'rgba(231, 122, 49, 1)',
				},
			},
			font: {
				color: 'rgba(238, 238, 238, 1)',
			},
		};
	}

	public getInputs(): ResourceAmount[]
	{
		return this.ingredients;
	}

	public getOutputs(): ResourceAmount[]
	{
		return this.products;
	}

	private getLabel(): string
	{
		return this.formatText(this.recipeData.recipe.name) + '\n' + Strings.formatNumber(this.recipeData.amount) + 'x ' + this.recipeData.machine.name;
	}

	private getTitle(): HTMLElement
	{
		const title: string[] = [];
		let amount = this.recipeData.amount * 1e2;

		if (amount >= this.recipeData.clockSpeed) {
			title.push(Math.floor(amount / this.recipeData.clockSpeed) + 'x ' + this.recipeData.machine.name + ' at <b>' + this.recipeData.clockSpeed + '%</b> clock speed');
			amount %= this.recipeData.clockSpeed;
		}

		if (amount >= 1e-9) {
			amount = Math.ceil(amount * 1e4) / 1e4; // TODO this sometimes adds +0.0001%

			title.push('1x ' + this.recipeData.machine.name + ' at <b>' + Strings.formatNumber(Math.max(1, amount), 4) + '%</b> clock speed');
		}

		title.push('');

		for (const ingredient of this.ingredients) {
			title.push('<b>IN:</b> ' + Strings.formatNumber(ingredient.maxAmount) + ' / min - ' + ingredient.resource.name);
		}
		for (const product of this.products) {
			title.push('<b>OUT:</b> ' + Strings.formatNumber(product.maxAmount) + ' / min - ' + product.resource.name);
		}

		const container = document.createElement('div');
		container.innerHTML = title.join('<br>');
		return container;
	}

	private getMultiplier(): number
	{
		return this.recipeData.amount * this.recipeData.machine.metadata.manufacturingSpeed * (this.recipeData.clockSpeed / 100) * (60 / this.recipeData.recipe.time);
	}

}
