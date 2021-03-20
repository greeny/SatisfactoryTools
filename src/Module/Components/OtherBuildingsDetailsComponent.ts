import {IComponentOptions} from 'angular';
import {OtherBuildingsDetailsComponentController} from '@src/Module/Components/OtherBuildingsDetailsComponentController';

export class OtherBuildingsDetailsComponent implements IComponentOptions
{

	public template: string = require('@templates/Components/otherBuildingDetails.html');
	public controller = OtherBuildingsDetailsComponentController;
	public controllerAs = 'ctrl';
	public bindings = {
		building: '=',
	};

}
