import {IItemAmountSchema} from '@src/Schema/IItemAmountSchema';

export interface IRecipeSchema
{

	slug: string;
	name: string;
	className: string;
	alternate: boolean;
	time: number;
	inHand: boolean;
	forBuilding: boolean;
	inWorkshop: boolean;
	inMachine: boolean;
	manualTimeMultiplier: number;
	ingredients: IItemAmountSchema[];
	products: IItemAmountSchema[];
	producedIn: string[];

}
