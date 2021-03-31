import {IDirective, IWindowService} from 'angular';
import {April} from '@src/Utils/April';

export class AppDirective implements IDirective
{

	public restrict = 'E';
	public template = require('@templates/Directives/app.html');
	public controller = ['$scope', '$window', ($scope: any, $window: IWindowService) => {
		$scope.disable = () => {
			April.disable();
			$window.location.reload();
		};
		$scope.enable = () => {
			April.enable();
			$window.location.reload();
		};
	}];

}
