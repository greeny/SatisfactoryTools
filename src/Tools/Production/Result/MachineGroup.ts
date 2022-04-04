import {MachineGroupMode} from '@src/Tools/Production/Result/MachineGroupMode';
import {Numbers} from '@src/Utils/Numbers';
import {RecipeData} from '@src/Tools/Production/Result/RecipeData';
import {IMachineGroupPower} from '@src/Tools/Production/Result/IMachineGroupPower';
import {IMachineGroupItem} from '@src/Tools/Production/Result/IMachineGroupItem';

export class MachineGroup
{

	public machines: IMachineGroupItem[] = [];
	public power: IMachineGroupPower;

	public constructor(public recipeData: RecipeData, public mode: MachineGroupMode = 'underclockLast')
	{
		this.recalculate();
	}

	public countMachines(): number
	{
		let result = 0;

		for (const machine of this.machines) {
			result += machine.amount;
		}

		return result;
	}

	public recalculate(): void
	{
		this.machines = [];

		switch (this.mode) {
			case 'roundUp':
				this.machines.push(this.getMachineData(Math.ceil(this.recipeData.amount), this.recipeData.clockSpeed));
				break;
			case 'underclockLast':
				const amount = Math.floor(this.recipeData.amount);
				if (amount > 0) {
					this.machines.push(this.getMachineData(amount, this.recipeData.clockSpeed));
				}

				const rest = this.recipeData.amount - Math.floor(this.recipeData.amount);
				if (rest > 0) {
					this.machines.push(this.getMachineData(1, Numbers.ceil(rest * this.recipeData.clockSpeed, 4)));
				}
				break;
			case 'underclockEqually':
			case 'underclockEquallyEven':
				let count = Math.ceil(this.recipeData.amount);
				if (this.mode === 'underclockEquallyEven' && count % 2 === 1) {
					count++;
				}

				const eachExact = this.recipeData.amount * this.recipeData.clockSpeed / count;
				const each = Numbers.floor(eachExact, 4);
				let boostedMachines = 0;

				if (eachExact - each > 1e-8) {
					boostedMachines = Math.ceil((eachExact - each) * count / 0.0001);
				}

				if (boostedMachines > 0) {
					this.machines.push(this.getMachineData(boostedMachines, each + 0.0001));
				}

				if (count - boostedMachines > 0) {
					this.machines.push(this.getMachineData(count - boostedMachines, each));
				}
				break;
		}

		this.power = this.sumPower();
	}

	private getMachineData(amount: number, clockSpeed: number): IMachineGroupItem
	{
		const result: IMachineGroupItem = {
			amount: amount,
			clockSpeed: clockSpeed,
			power: {
				average: 0,
				isVariable: false,
				max: 0
			},
		};

		result.power = this.getPower(result);
		return result;
	}

	private getPower(machine: IMachineGroupItem): IMachineGroupPower
	{
		let power = 0;
		let max = 0;
		let isVariable = false;

		power += machine.amount * (this.recipeData.machine.metadata.powerConsumption * Math.pow(machine.clockSpeed / 100, this.recipeData.machine.metadata.powerConsumptionExponent));

		if (this.recipeData.recipe.isVariablePower) {
			max = machine.amount * this.recipeData.recipe.maxPower * Math.pow(machine.clockSpeed / 100, this.recipeData.machine.metadata.powerConsumptionExponent);
			const min = machine.amount * this.recipeData.recipe.minPower * Math.pow(machine.clockSpeed / 100, this.recipeData.machine.metadata.powerConsumptionExponent);
			power = (max + min) / 2;
			isVariable = true;
		}

		if (this.mode === 'roundUp') {
			max = power;
			isVariable = true;
			power = power / Math.ceil(this.recipeData.amount) * this.recipeData.amount;
		}

		if (max < power) {
			max = power;
		}

		if (Math.abs(max - power) < 1e-8) {
			isVariable = false;
		}

		return {
			average: power,
			isVariable: isVariable,
			max: max,
		};
	}

	private sumPower(): IMachineGroupPower
	{
		const power: IMachineGroupPower = {
			max: 0,
			isVariable: false,
			average: 0,
		};

		for (const machine of this.machines) {
			power.average += machine.power.average;
			power.max += machine.power.max;
			if (machine.power.isVariable) {
				power.isVariable = true;
			}
		}

		if (Math.abs(power.max - power.average) < 1e-8) {
			power.isVariable = false;
		}

		return power;
	}

}
