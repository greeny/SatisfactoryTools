export class Arrays
{

	public static ensureArray(item: any): any[]
	{
		return Array.isArray(item) ? item : [item];
	}

}
