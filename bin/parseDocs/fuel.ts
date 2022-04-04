import {IFuelSchema} from '@src/Schema/IFuelSchema';

export function parseFuels(fuels: {
	mFuelClass: string,
	mSupplementalResourceClass: string,
	mByproduct: string,
	mByproductAmount: string,
}[]): IFuelSchema[]
{
	const result: IFuelSchema[] = [];

	for (const fuel of fuels) {
		result.push({
			item: fuel.mFuelClass,
			supplementalItem: fuel.mSupplementalResourceClass || null,
			byproduct: fuel.mByproduct || null,
			byproductAmount: fuel.mByproductAmount ? parseInt(fuel.mByproductAmount) : null,
		});
	}

	return result;
}
