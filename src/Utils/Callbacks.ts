export class Callbacks
{

	public static debounce<F extends (...args: any[]) => any>(func: F, wait: number = 300): F
	{
		let timeoutID: number;

		return function(this: any, ...args: any[]) {
			clearTimeout(timeoutID);
			const context = this;

			timeoutID = window.setTimeout(() => {
				func.apply(context, args);
			}, wait);
		} as any;
	}

}
