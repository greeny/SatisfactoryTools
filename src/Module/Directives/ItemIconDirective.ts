import {IDirective} from 'angular';

export class ItemIconDirective implements IDirective
{

	public restrict = 'E';
	public template = require('@templates/Directives/itemIcon.html');
	public scope = {
		item: '=item',
		size: '=size',
	};

}
