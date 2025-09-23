import {IItemSchema} from '@src/Schema/IItemSchema';
import { Numbers } from '@src/Utils/Numbers';

export class ResourceAmount
{

	public constructor(public readonly resource: IItemSchema, public readonly maxAmount: number, public amount: number)
	{
	}

	public increase(diff: number) {
		this.amount = Numbers.round(this.amount + diff);
	}

	public decrease(diff: number) {
		this.amount = Numbers.round(this.amount - diff);
	}

}
