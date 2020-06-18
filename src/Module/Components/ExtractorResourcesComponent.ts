import {IComponentOptions} from 'angular';
import {ExtractorResourcesComponentController} from '@src/Module/Components/ExtractorResourcesComponentController';

export class ExtractorResourcesComponent implements IComponentOptions
{

	public template: string = require('@templates/Components/extractorResources.html');
	public controller = ExtractorResourcesComponentController;
	public controllerAs = 'ctrl';
	public bindings = {
		building: '=',
	};

}
