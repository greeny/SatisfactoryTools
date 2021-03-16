import {IItemSchema} from '@src/Schema/IItemSchema';

export class ResourceAmount
{

	public constructor(public readonly resource: IItemSchema, public readonly maxAmount: number, public amount: number)
	{
	}

}
