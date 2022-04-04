import {IFuelSchema} from '@src/Schema/IFuelSchema';

export interface IGeneratorSchema
{

	className: string;
	fuel: string[];
	fuels: IFuelSchema[];
	powerProduction: number;
	powerProductionExponent: number;
	waterToPowerRatio: number;
}
