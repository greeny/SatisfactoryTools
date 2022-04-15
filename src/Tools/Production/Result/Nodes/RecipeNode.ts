import {GraphNode} from '@src/Tools/Production/Result/Nodes/GraphNode';
import {RecipeData} from '@src/Tools/Production/Result/RecipeData';
import {IVisNode} from '@src/Tools/Production/Result/IVisNode';
import {IJsonSchema} from '@src/Schema/IJsonSchema';
import {ResourceAmount} from '@src/Tools/Production/Result/ResourceAmount';
import {Strings} from '@src/Utils/Strings';
import {MachineGroup} from '@src/Tools/Production/Result/MachineGroup';
import {Numbers} from '@src/Utils/Numbers';

export class RecipeNode extends GraphNode
{

	public ingredients: ResourceAmount[] = [];
	public products: ResourceAmount[] = [];
	public machineData: MachineGroup;

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
		this.machineData = new MachineGroup(this.recipeData);
	}

	public getInputs(): ResourceAmount[]
	{
		return this.ingredients;
	}

	public getOutputs(): ResourceAmount[]
	{
		return this.products;
	}

	public getTitle(): string
	{
		return this.formatText(this.recipeData.recipe.name) + '\n' + Strings.formatNumber(this.recipeData.amount) + 'x ' + this.recipeData.machine.name;
	}

	public getTooltip(): string|null
	{
		const title: string[] = [];
		for (const machine of this.machineData.machines) {
			title.push(machine.amount + 'x ' + this.recipeData.machine.name + ' at <b>' + machine.clockSpeed + '%</b> clock speed');
		}

		title.push('');
		title.push('Needed power: ' + Numbers.round(this.machineData.power.average) + ' MW');
		title.push('');

		for (const ingredient of this.ingredients) {
			title.push('<b>IN:</b> ' + Strings.formatNumber(ingredient.maxAmount) + ' / min - ' + ingredient.resource.name);
		}
		for (const product of this.products) {
			title.push('<b>OUT:</b> ' + Strings.formatNumber(product.maxAmount) + ' / min - ' + product.resource.name);
		}

		return title.join('<br>');
	}

	public getVisNode(): IVisNode
	{
		const el = document.createElement('div');
		el.innerHTML = this.getTooltip() || '';
		return {
			id: this.id,
			label: this.getTitle(),
			title: el as unknown as string,
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

	private getMultiplier(): number
	{
		return this.recipeData.amount * this.recipeData.machine.metadata.manufacturingSpeed * (this.recipeData.clockSpeed / 100) * (60 / this.recipeData.recipe.time);
	}

}
