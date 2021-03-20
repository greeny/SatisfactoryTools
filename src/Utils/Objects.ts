export class Objects {

	public static isObject(object: any): boolean {
		return typeof object === 'object' && object !== null;
	}

	public static sortByKeys(object: { [key: string]: any }): { [key: string]: any } {
		const sorted: { [key: string]: any } = {};
		Object.keys(object).sort().forEach((key: string) => {
			sorted[key] = object[key];
		});
		return sorted;
	}

	public static deepCopy(entry: any): any {
		return JSON.parse(JSON.stringify(entry));
	}
}
