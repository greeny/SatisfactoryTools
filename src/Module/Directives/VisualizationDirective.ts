import {IAttributes, IDirective, IScope} from 'angular';
import {Network} from 'vis-network';
import {ProductionToolResult} from '@src/Tools/Production/ProductionToolResult';

export class VisualizationDirective implements IDirective
{

	public restrict = 'E';
	public template = '';
	public scope = {
		result: '=result',
	};

	public link(scope: IScope, element: JQLite, attrs: IAttributes)
	{
		const result: ProductionToolResult = attrs.result;
		const network = new Network(element[0], {
			nodes: result.nodes,
			edges: result.edges,
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
		scope.$watch(() => {
			return attrs.result;
		}, () => {
			const result: ProductionToolResult = attrs.result;
			network.setData({
				nodes: result.nodes,
				edges: result.edges,
			});
		}, true);
	};

}
