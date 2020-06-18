import {IComponentOptions} from 'angular';
import {VisualizationComponentController} from '@src/Module/Components/VisualizationComponentController';

export class VisualizationComponent implements IComponentOptions
{

	public template: string = '';
	public controller = VisualizationComponentController;
	public bindings = {
		result: '=',
	};

}
