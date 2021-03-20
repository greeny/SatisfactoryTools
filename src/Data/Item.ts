import {IItemSchema} from '@src/Schema/IItemSchema';
import {Model} from '@src/Data/Model';

export class Item
{

	public constructor(private readonly model: Model, public readonly prototype: IItemSchema)
	{
		//
	}


}
