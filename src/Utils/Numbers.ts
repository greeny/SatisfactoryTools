export class Numbers
{

	public static round(num: number, decimals: number = 3): number
	{
		return Math.round((num + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
	}

	public static ceil(num: number, decimals: number = 3): number
	{
		return Math.ceil((num + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
	}

	public static floor(num: number, decimals: number = 3): number
	{
		return Math.floor((num + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
	}

}
