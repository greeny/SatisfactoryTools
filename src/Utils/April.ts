export class April
{

	private static readonly KEY = 'aprilModeDisabled';

	public static isApril(): boolean
	{
		let result = April.isAprilPossible();

		if (localStorage.getItem(April.KEY) !== null) {
			result = false;
		}

		return result;
	}

	public static isAprilPossible(): boolean
	{
		const date = new Date();
		return date.getMonth() === 3 && date.getDate() === 1;
	}


	public static disable(): void
	{
		localStorage.setItem(April.KEY, '1');
	}

	public static enable(): void
	{
		localStorage.removeItem(April.KEY);
	}

}
