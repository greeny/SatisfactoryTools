import {IItemAmountSchema} from '@src/Schema/IItemAmountSchema';

export interface IRecipeSchema
{

	slug: string;
	name: string;
	className: string;
	alternate: boolean;
	time: number;
	manualTimeMultiplier: number;
	ingredients: IItemAmountSchema[];
	products: IItemAmountSchema[];
	producedIn: string[];

}
