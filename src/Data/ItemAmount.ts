import {Item} from '@src/Data/Item';

export class ItemAmount
{

	public constructor(public item: Item, public amount: number, public max: boolean = false, public ratio: number = 100)
	{

	}

}
