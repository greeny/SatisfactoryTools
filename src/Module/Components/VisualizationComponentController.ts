import {Network} from 'vis-network';
import {IController, IScope} from 'angular';
import {ProductionToolResult} from '@src/Tools/Production/ProductionToolResult';

export class VisualizationComponentController implements IController
{

	public result: ProductionToolResult;

	public static $inject = ['$element', '$scope'];
	private unregisterWatcherCallback: () => void;

	public constructor(private $element: any, private $scope: IScope) {}


	public $onInit(): void
	{
		this.unregisterWatcherCallback = this.$scope.$watch(() => {
			return this.result;
		}, (newValue) => {
			this.updateData(newValue);
		});
	}

	public $onDestroy(): void
	{
		this.unregisterWatcherCallback();
	}

	public updateData(result: ProductionToolResult|undefined): void
	{
		if (!result) {
			return;
		}
		const network = new Network(this.$element[0], result ? {
			nodes: result.nodes,
			edges: result.edges,
		} : {
			nodes: [],
			edges: [],
		}, {
			edges: {
				labelHighlightBold: false,
				color: '#697d91',
				font: {
					size: 14,
					multi: 'html',
					color: '#eeeeee',
					strokeColor: 'rgba(0, 0, 0, 0.2)',
				},
				arrows: 'to',
				smooth: true,
			},
			nodes: {
				labelHighlightBold: false,
				font: {
					size: 14,
					multi: 'html',
					color: '#eeeeee',
				},
				color: {
					background: '#df691a',
					border: 'rgba(0,0,0,0)',
					highlight: {
						background: '#e77a31',
						border: '#eeeeee',
					},
				},
				margin: {
					top: 10,
					left: 10,
					right: 10,
					bottom: 10,
				},
				shape: 'box',
			},
			physics: {
				enabled: false,
			},
			layout: {
				hierarchical: {
					direction: 'UD',
					blockShifting: true,
					edgeMinimization: true,
					parentCentralization: true,
					sortMethod: 'directed',
					nodeSpacing: 300,
					treeSpacing: 300,
					levelSeparation: 200,
				},
			},
		});
		network.setOptions({
			layout: {
				hierarchical: false,
			},
		});
	}

}
