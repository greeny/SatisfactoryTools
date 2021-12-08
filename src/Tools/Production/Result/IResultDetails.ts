import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {IMachineGroupPower} from '@src/Tools/Production/Result/IMachineGroupPower';
import {IMachineGroupItem} from '@src/Tools/Production/Result/IMachineGroupItem';

export interface IResultDetails
{

	buildings: IBuildingsResultDetails;
	items: {
		[key: string]: IItemResultDetails;
	};
	input: {
		[key: string]: IInputResultDetails;
	};
	power: {
		byRecipe: {
			[key: string]: IRecipePowerDetails;
		};
		byBuilding: {
			[key: string]: IMachinePowerDetails;
		};
		total: IMachineGroupPower;
	};
	hasInput: boolean;
	rawResources: {[key: string]: IRawResourceResultDetails};
	output: {[key: string]: number};
	byproducts: {[key: string]: number};
	alternatesNeeded: IRecipeSchema[],

}

export interface IBuildingsResultDetails
{

	buildings: {
		[key: string]: IBuildingResultDetails;
	};
	resources: IResourcesResultDetails;
	amount: number;

}

export interface IBuildingResultDetails
{

	amount: number;
	recipes: {
		[key: string]: IBuildingRecipeResultDetails;
	};
	resources: IResourcesResultDetails;

}

export interface IBuildingRecipeResultDetails
{

	amount: number;
	resources: IResourcesResultDetails;

}

export interface IResourcesResultDetails
{

	[key: string]: number;

}

export interface IItemResultDetails
{

	produced: number;
	consumed: number;
	diff: number;
	producers: {
		[key: string]: IItemBuildingAmountResultDetails;
	};
	consumers: {
		[key: string]: IItemBuildingAmountResultDetails;
	};

}

export interface IItemBuildingAmountResultDetails
{

	type: string;
	itemAmount: number;
	itemPercentage: number;

}

export interface IInputResultDetails
{

	max: number;
	used: number;
	usedPercentage: number;
	producedExtra: number;

}

export interface IRawResourceResultDetails
{

	enabled: boolean;
	max: number;
	used: number;
	usedPercentage: number;

}

export interface IRecipePowerDetails
{

	machine: string;
	machines: IMachineGroupItem[];
	power: IMachineGroupPower;

}

export interface IMachinePowerDetails
{

	amount: number;
	recipes: {[key: string]: IMachineGroupItem};
	power: IMachineGroupPower;

}
