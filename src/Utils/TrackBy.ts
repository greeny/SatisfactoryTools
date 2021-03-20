import {IItemAmountSchema} from '@src/Schema/IItemAmountSchema';

interface IClassName {
	className: string;
}

export class TrackBy {
	public static byClassName(index: number, item: IClassName): string {
		return item.className;
	}

	public static byItemAmountSchema(index: number, value: IItemAmountSchema): string{
		return value.item;
	}

	public static byString(index: number, value: string): string {
		return value;
	}
}
