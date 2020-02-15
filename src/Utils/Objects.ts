export class Objects
{

	public static isObject(object: any): boolean
	{
		return typeof object === 'object' && object !== null;
	}

}
