import {IColorSchema} from '@src/Schema/IColorSchema';

export interface IItemSchema
{

	slug: string;
	name: string;
	sinkPoints: number;
	description: string;
	className: string;
	stackSize: number;
	energyValue: number;
	radioactiveDecay: number;
	liquid: boolean;
	fluidColor: IColorSchema;

}
