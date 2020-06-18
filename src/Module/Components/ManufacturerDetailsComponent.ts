import {IComponentOptions} from 'angular';
import {ManufacturerDetailsComponentController} from '@src/Module/Components/ManufacturerDetailsComponentController';

export class ManufacturerDetailsComponent implements IComponentOptions
{

	public template: string = require('@templates/Components/manufacturerDetails.html');
	public controller = ManufacturerDetailsComponentController;
	public controllerAs = 'ctrl';
	public bindings = {
		building: '=',
	};

}
