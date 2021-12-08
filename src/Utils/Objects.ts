export class Objects
{

	public static isObject(object: any): boolean
	{
		return typeof object === 'object' && object !== null;
	}

	public static sortByKeys(object: {[key: string]: any}, callable?: (item1: string, item2: string) => number): {[key: string]: any}
	{
		const sorted: {[key: string]: any} = {};
		if (callable) {
			Object.keys(object).sort(callable).forEach((key: string) => {
				sorted[key] = object[key];
			});
		} else {
			Object.keys(object).sort().forEach((key: string) => {
				sorted[key] = object[key];
			});
		}
		return sorted;
	}

}
