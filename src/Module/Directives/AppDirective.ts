import {IDirective, IWindowService} from 'angular';
import {April} from '@src/Utils/April';
import {NewToolsService} from '@src/Module/Services/NewToolsService';

export class AppDirective implements IDirective
{

	public restrict = 'E';
	public template = require('@templates/Directives/app.html');
	public controller = ['$scope', '$window', 'NewToolsService', ($scope: any, $window: IWindowService, newToolsService: NewToolsService) => {
		$scope.disable = () => {
			April.disable();
			$window.location.reload();
		};
		$scope.enable = () => {
			April.enable();
			$window.location.reload();
		};

		// the permanent navbar item and info banner pointing at the new tools, hidden until the new tools are live at the root
		$scope.newTools = {
			url: NewToolsService.NEW_TOOLS_URL,
			visible: NewToolsService.PROMOTE_NEW_TOOLS,
		};

		$scope.newTools.trackNavbarLink = () => {
			newToolsService.track('navbar-link');
		};
	}];

}
