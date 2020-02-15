import {IColorSchema} from '@src/Schema/IColorSchema';

export interface IItemSchema
{

	slug: string;
	name: string;
	description: string;
	className: string;
	stackSize: number;
	energyValue: number;
	radioactiveDecay: number;
	resourceSinkPoints: number;
	liquid: boolean;
	fluidColor: IColorSchema;

}
