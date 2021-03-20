import parseBlueprintClass from '@bin/parseDocs/blueprintClass';
import {IItemAmountSchema} from '@src/Schema/IItemAmountSchema';

export default function parseItemAmount(value: {
	ItemClass: string;
	Amount: string;
}): IItemAmountSchema
{
	return {
		item: parseBlueprintClass(value.ItemClass),
		amount: parseInt(value.Amount),
	}
}
