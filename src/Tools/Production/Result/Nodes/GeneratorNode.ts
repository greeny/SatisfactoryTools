import {GraphNode} from '@src/Tools/Production/Result/Nodes/GraphNode';
import {IVisNode} from '@src/Tools/Production/Result/IVisNode';
import {IJsonSchema} from '@src/Schema/IJsonSchema';
import {ResourceAmount} from '@src/Tools/Production/Result/ResourceAmount';
import {Strings} from '@src/Utils/Strings';
import {GeneratorData} from '@src/Tools/Production/Result/GeneratorData';
import {Constants} from '@src/Constants';

export class GeneratorNode extends GraphNode
{

	public ingredients: ResourceAmount[] = [];
	public products: ResourceAmount[] = [];
	private powerProduced: number;

	public constructor(public readonly generatorData: GeneratorData, data: IJsonSchema)
	{
		super();

		for (const fuelData of generatorData.generator.fuels) {
			if (fuelData.item === generatorData.fuel.className) {
				const powerProduction = generatorData.generator.powerProduction * Math.pow(generatorData.clockSpeed / 100, generatorData.generator.powerProductionExponent);
				this.powerProduced = powerProduction * generatorData.amount;
				let ratio = 60 / (generatorData.fuel.liquid ? 1000 : 1);
				const fuelConsumption = powerProduction / generatorData.fuel.energyValue * ratio;

				this.ingredients.push(new ResourceAmount(generatorData.fuel, fuelConsumption * generatorData.amount, 0));

				if (fuelData.supplementalItem) {
					ratio = 60 / (data.items[fuelData.supplementalItem].liquid ? 1000 : 1);
					this.ingredients.push(new ResourceAmount(data.items[fuelData.supplementalItem], powerProduction * generatorData.generator.waterToPowerRatio * ratio * generatorData.amount, 0));
				}

				if (fuelData.byproduct && fuelData.byproductAmount) {
					const wasteAmount = fuelConsumption * fuelData.byproductAmount * generatorData.amount;
					this.products.push(new ResourceAmount(data.items[fuelData.byproduct], wasteAmount, wasteAmount));
				}

				this.products.push(new ResourceAmount(data.items[Constants.POWER_CLASSNAME], this.powerProduced, this.powerProduced));
				break;
			}
		}
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
		return this.formatText(this.generatorData.fuel.name) + '\n' + Strings.formatNumber(this.generatorData.amount) + 'x ' + this.generatorData.machine.name + '\n<i>' + this.generatorData.clockSpeed + '% clock speed</i>';
	}

	public getTooltip(): string|null
	{
		const title: string[] = [];
		/*for (const machine of this.machineData.machines) {
			title.push(machine.amount + 'x ' + this.recipeData.machine.name + ' at <b>' + machine.clockSpeed + '%</b> clock speed');
		}

		title.push('');*/

		title.push('Produced power: ' + Strings.formatItemAmount(this.powerProduced, Constants.POWER_CLASSNAME));
		title.push('');

		for (const ingredient of this.ingredients) {
			title.push('<b>IN:</b> ' + Strings.formatItemAmount(ingredient.maxAmount, ingredient.resource.className) + ' - ' + ingredient.resource.name);
		}
		for (const product of this.products) {
			title.push('<b>OUT:</b> ' + Strings.formatItemAmount(product.maxAmount, product.resource.className) + ' - ' + product.resource.name);
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
				background: 'rgba(83, 119, 227, 1)',
				highlight: {
					border: 'rgba(238, 238, 238, 1)',
					background: 'rgba(108, 139, 231, 1)',
				},
			},
			font: {
				color: 'rgba(238, 238, 238, 1)',
			},
		};
	}

}
