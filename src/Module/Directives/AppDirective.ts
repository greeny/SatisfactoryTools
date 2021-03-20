import {IDirective} from 'angular';

export class AppDirective implements IDirective
{

	public restrict = 'E';
	public template = require('@templates/Directives/app.html');

}
