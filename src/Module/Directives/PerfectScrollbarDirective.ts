import {IDirective, IScope} from 'angular';
import PerfectScrollbar from 'perfect-scrollbar';

export class PerfectScrollbarDirective implements IDirective
{
	public restrict = 'A';

	public link(scope: IScope, element: JQLite): void
	{
		const foo = new PerfectScrollbar(element[0], {
			suppressScrollX: true,
		});
	}
}
