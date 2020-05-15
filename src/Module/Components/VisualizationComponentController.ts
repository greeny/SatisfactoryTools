import {Data, Network} from 'vis-network';
import {IScope} from 'angular';
import {ProductionToolResult} from '@src/Tools/Production/ProductionToolResult';

export class VisualizationComponentController
{

	private network: Network;

	public $onInit(): void
	{
		console.log('a');
	}

	public result: ProductionToolResult;

	public static $inject = ['$element', '$scope'];

	public constructor($element: any, $scope: IScope)
	{
		setTimeout(() => {
			console.log(this.result);
		}, 1000);
		this.network = new Network($element[0], {
			nodes: this.result.nodes,
			edges: this.result.edges,
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
		this.network.setOptions({
			layout: {
				hierarchical: false,
			},
		});
	}

	public updateData(result: Data)
	{
		this.network.setData(result);
	}

}
