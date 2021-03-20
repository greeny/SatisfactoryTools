import {IComponentOptions} from 'angular';
import {ExtractorDetailsComponentController} from '@src/Module/Components/ExtractorDetailsComponentController';

export class ExtractorDetailsComponent implements IComponentOptions
{

	public template: string = require('@templates/Components/extractorDetails.html');
	public controller = ExtractorDetailsComponentController;
	public controllerAs = 'ctrl';
	public bindings = {
		building: '=',
	};

}
