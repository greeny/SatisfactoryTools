import {IComponentOptions} from 'angular';
import {VisualizationComponentController} from '@src/Module/Components/VisualizationComponentController';

export class VisualizationComponent implements IComponentOptions
{

	template: string = '';
	controller = VisualizationComponentController;
	bindings = {
		result: '=',
	};

}
