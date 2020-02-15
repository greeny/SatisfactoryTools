import {IItemAmountSchema} from '@src/Schema/IItemAmountSchema';

export interface ISchematicSchema
{

	className: string;
	type: string;
	name: string;
	cost: IItemAmountSchema[];
	unlock: string[];
	tier: number;
	time: number;
	mam: boolean;
	alternate: boolean;

}
