import {Recipe} from '@src/Data/Recipe';
import {IMachinesResult} from '@src/Tools/Production/IMachinesResult';

export class RecipeResult
{

	public machines: IMachinesResult[] = [];
	public nodeId: number;
	public productAmountCache: {
		product: string,
		amount: number,
		maxAmount: number,
	}[] = [];

	public constructor(public readonly recipe: Recipe, public readonly amount: number)
	{
		const machines = amount * recipe.prototype.time / recipe.machine.metadata.manufacturingSpeed;
		this.machines.push({
			amount: machines,
			maxAmount: null,
			overclock: 100,
			lastMachineOverclock: 100,
		});
		for (const product of recipe.products) {
			const itemsPerMachine = 60 * recipe.machine.metadata.manufacturingSpeed / recipe.prototype.time;
			this.productAmountCache.push({
				product: product.item.prototype.className,
				maxAmount: itemsPerMachine * machines * product.amount,
				amount: itemsPerMachine * machines * product.amount,
			});
		}
	}

	public getMachineCount(): number
	{
		let count = 0;
		for (const machine of this.machines) {
			count += machine.amount;
		}
		return count;
	}

	public getMachineTooltip(): string
	{
		const texts: string[] = [];
		for (const machine of this.machines) {
			texts.push(machine.amount.toFixed(2) + 'x at ' + machine.overclock + '%');
		}
		return texts.join('\n');
	}

}
