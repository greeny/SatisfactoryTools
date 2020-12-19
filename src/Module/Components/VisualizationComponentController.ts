import {Network} from 'vis-network';
import {IController, IScope, ITimeoutService} from 'angular';
import {ProductionToolResult} from '@src/Tools/Production/ProductionToolResult';
import ELK from 'elkjs/lib/elk.bundled';

export class VisualizationComponentController implements IController
{

	public result: ProductionToolResult;

	public static $inject = ['$element', '$scope', '$timeout'];
	private unregisterWatcherCallback: () => void;

	public constructor(private readonly $element: any, private readonly $scope: IScope, private readonly $timeout: ITimeoutService) {}


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

		this.$timeout(0).then(() => {
			if (!result.nodeLocationCache) {
				const elk = new ELK();
				elk.layout(result.elkGraph).then((data) => {
					result.nodes.forEach((node) => {
						const id = node.id;
						if (data.children) {
							for (const item of data.children) {
								if (parseInt(item.id, 10) === id) {
									result.nodes.update({
										id: id,
										x: item.x,
										y: item.y,
									});
									return;
								}
							}
						}
					});
				});
			} else {
				for (const id in result.nodeLocationCache) {
					const position = result.nodeLocationCache[id];
					result.nodes.update({
						id: parseInt(id, 10),
						x: position.x,
						y: position.y,
					});
				}
			}

			this.drawVisualization(result);
		});
	}

	private drawVisualization(result: ProductionToolResult|undefined): void
	{
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
				smooth: false,
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
				improvedLayout: false,
				hierarchical: false,
			},
		});

		network.setOptions({
			layout: {
				hierarchical: false,
			},
		});

		if (result) {
			result.nodeLocationCache = network.getPositions();
			network.on('dragEnd', () => {
				result.nodeLocationCache = network.getPositions();
			});
		}
	}

}
