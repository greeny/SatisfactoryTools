import {IComponentOptions} from 'angular';
import {CodexController} from '@src/Module/Components/CodexController';

export class CodexComponent implements IComponentOptions
{

	public template: string = require('@templates/Components/codexComponent.html');
	public controller = CodexController;
	public controllerAs = 'ctrl';
	public bindings = {
		filterService: '=',
		entityPreviewState: '@',
	};

}
