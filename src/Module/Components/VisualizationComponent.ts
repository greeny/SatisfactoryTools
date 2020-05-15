import {IComponentOptions} from 'angular';

export class VisualizationComponent implements IComponentOptions
{

	template: string = '';
	controller: string = 'VisualizationComponentController';
	bindings = {
		result: '@',
	};

}
