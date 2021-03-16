import {DataSet, Network} from 'vis-network';
import {IController, IScope, ITimeoutService} from 'angular';
import ELK from 'elkjs/lib/elk.bundled';
import {ProductionResult} from '@src/Tools/Production/ProductionResult';
import {IVisNode} from '@src/Tools/Production/Result/IVisNode';
import {IVisEdge} from '@src/Tools/Production/Result/IVisEdge';
import {IElkGraph} from '@src/Solver/IElkGraph';

export class VisualizationComponentController implements IController
{

	public result: ProductionResult;

	public static $inject = ['$element', '$scope', '$timeout'];

	private unregisterWatcherCallback: () => void;
	private network: Network;
	private fitted: boolean = false;

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

	public updateData(result: ProductionResult|undefined): void
	{
		if (!result) {
			return;
		}

		this.fitted = false;

		const nodes = result ? result.graph.visNodes : new DataSet<IVisNode>();
		const edges = result ? result.graph.visEdges : new DataSet<IVisEdge>();

		this.network = this.drawVisualisation(nodes, edges);

		this.$timeout(0).then(() => {
			const elkGraph: IElkGraph = {
				id: 'root',
				layoutOptions: {
					'elk.algorithm': 'org.eclipse.elk.conn.gmf.layouter.Draw2D',
					'org.eclipse.elk.layered.nodePlacement.favorStraightEdges': true as unknown as string, // fuck off typescript
					'org.eclipse.elk.spacing.nodeNode': 40 + '',
				},
				children: [],
				edges: [],
			};

			nodes.forEach((node) => {
				elkGraph.children.push({
					id: node.id.toString(),
					width: 250,
					height: 100,
				});
			});
			edges.forEach((edge) => {
				elkGraph.edges.push({
					id: '',
					source: edge.from.toString(),
					target: edge.to.toString(),
				});
			});

			this.$timeout(0).then(() => {
				const elk = new ELK();
				elk.layout(elkGraph).then((data) => {
					nodes.forEach((node) => {
						const id = node.id;
						if (data.children) {
							for (const item of data.children) {
								if (parseInt(item.id, 10) === id) {
									nodes.update({
										id: id,
										x: item.x,
										y: item.y,
									});
									return;
								}
							}
						}
					});

					if (!this.fitted) {
						this.fitted = true;
						this.network.fit();
					}
				});
			});
		});
	}

	private drawVisualisation(nodes: DataSet<IVisNode>, edges: DataSet<IVisEdge>): Network
	{
		return new Network(this.$element[0], {
			nodes: nodes,
			edges: edges,
		}, {
			edges: {
				labelHighlightBold: false,
				font: {
					size: 14,
					multi: 'html',
					strokeColor: 'rgba(0, 0, 0, 0.2)',
				},
				arrows: 'to',
				smooth: false,
			},
			nodes: {
				labelHighlightBold: false,
				font: {
					// align: 'left',
					size: 14,
					multi: 'html',
				},
				margin: {
					top: 10,
					left: 10,
					right: 10,
					bottom: 10,
				},
				shape: 'box',
				widthConstraint: {
					minimum: 50,
					maximum: 250,
				},
				// widthConstraint: 225,
			},
			physics: {
				enabled: false,
			},
			layout: {
				improvedLayout: false,
				hierarchical: false,
			},
			interaction: {
				tooltipDelay: 0,
			},
		});
	}

}
