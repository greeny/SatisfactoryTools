import { Numbers } from '@src/Utils/Numbers';

export class ItemAmount
{

	public consumed: number = 0.0;
	public limit?: number;

	public constructor(public readonly item: string, public amount: number)
	{
	}

	public increaseConsumed(diff: number): number {
		const available = this.getAvailable();
		const maxDiff = Math.min(available, diff);

		this.consumed = Numbers.round(this.consumed + maxDiff);

		return maxDiff;
	}

	public increaseLimit(diff: number): number {
		const buffer = this.getBuffer();
		const maxDiff = Math.min(buffer, diff);

		this.limit = Numbers.round((this.limit || 0) + maxDiff);

		return maxDiff;
	}

	public getConsumed(): number {
		return this.consumed;
	}

	public getAvailable(): number {
		return Numbers.round(this.getAmount() - this.consumed);
	}

	public getBuffer(): number {
		return Numbers.round(this.amount - (this.limit || 0));
	}

	public getAmount(): number {
		return this.limit === undefined
			? this.amount
			: this.limit;
	}

}
