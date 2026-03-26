import {DataSet, Network} from 'vis-network';
import {IController, IScope, ITimeoutService} from 'angular';
import ELK from 'elkjs/lib/elk.bundled';
import cytoscape from 'cytoscape';
import {IVisNode} from '@src/Tools/Production/Result/IVisNode';
import {IVisEdge} from '@src/Tools/Production/Result/IVisEdge';
import {IElkGraph} from '@src/Solver/IElkGraph';
import {Strings} from '@src/Utils/Strings';
import model from '@src/Data/Model';
import {ProductionResult} from '@src/Tools/Production/Result/ProductionResult';

const DONE_NODE_BORDER = 'rgba(180, 255, 180, 0.9)';
const DONE_NODE_BORDER_HL = 'rgba(220, 255, 220, 1)';
const DONE_NODE_BORDER_WIDTH = 1;
const DONE_NODE_BG_ALPHA = 0.35;
const DONE_FONT_ALPHA = 0.45;

const DONE_EDGE_COLOR = 'rgba(105, 125, 145, 0.3)';
const DONE_EDGE_COLOR_HL = 'rgba(134, 151, 167, 0.45)';
const DONE_EDGE_FONT_COLOR = 'rgba(238, 238, 238, 0.3)';

const STORAGE_KEY_PREFIX = 'doneNodes_';

function fadeRgba(rgba: string, alpha: number): string
{
	const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);

	if (!m) {
		return rgba;
	}

	return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${alpha})`;
}

export class VisualizationComponentController implements IController
{

	public result: ProductionResult;

	public storageKey: string;

	public static $inject = ['$element', '$scope', '$timeout'];

	private unregisterWatcherCallback: () => void;
	private network: Network;
	private fitted: boolean = false;

	private doneKeys: Set<string> = new Set();

	private visNodes: DataSet<IVisNode>;
	private visEdges: DataSet<IVisEdge>;

	private nodeStyles: Map<number, { stableKey: string; originalColor: any; originalFont: any }> = new Map();
	private edgeStyles: Map<number, { stableKey: string; originalColor: any; originalFont: any }> = new Map();

	public constructor(private readonly $element: any, private readonly $scope: IScope, private readonly $timeout: ITimeoutService) {}


	public $onInit(): void
	{
		this.unregisterWatcherCallback = this.$scope.$watch(() => {
			return {
				result: this.result,
				storageKey: this.storageKey,
			};
		}, (newValue: { result: ProductionResult; storageKey: string }) => {
			this.updateData(newValue.result, newValue.storageKey);
		}, true);
	}

	public $onDestroy(): void
	{
		this.unregisterWatcherCallback();
	}

	private loadDoneKeys(key: string): void
	{
		try {
			const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);

			this.doneKeys = raw ? new Set(JSON.parse(raw)) : new Set();
		} catch {
			this.doneKeys = new Set();
		}
	}

	private saveDoneKeys(): void
	{
		try {
			const key = STORAGE_KEY_PREFIX + (this.storageKey || 'default');

			localStorage.setItem(key, JSON.stringify([...this.doneKeys]));
		} catch { /* storage full: silently ignore */ }
	}

	private applyDoneNodeStyle(id: number, isDone: boolean): void
	{
		const meta = this.nodeStyles.get(id);

		if (!meta) {
			return;
		}

		if (isDone) {
			const orig = meta.originalColor;

			this.visNodes.update({
				id,
				color: {
					border:     DONE_NODE_BORDER,
					background: fadeRgba(orig.background, DONE_NODE_BG_ALPHA),
					highlight: {
						border:     DONE_NODE_BORDER_HL,
						background: fadeRgba(orig.highlight.background, DONE_NODE_BG_ALPHA),
					},
				},
				borderWidth: DONE_NODE_BORDER_WIDTH,
				borderWidthSelected: DONE_NODE_BORDER_WIDTH + 1,
				font: {
					color: fadeRgba(meta.originalFont.color, DONE_FONT_ALPHA),
				},
			} as any);
		} else {
			this.visNodes.update({
				id,
				color: meta.originalColor,
				borderWidth: 0,
				borderWidthSelected: 1,
				font: meta.originalFont,
			} as any);
		}
	}

	private applyDoneEdgeStyle(id: number, isDone: boolean): void
	{
		const meta = this.edgeStyles.get(id);
		if (!meta) { return; }
		if (isDone) {
			this.visEdges.update({
				id,
				color: {
					color: DONE_EDGE_COLOR,
					highlight: DONE_EDGE_COLOR_HL,
				},
				font: {
					color: DONE_EDGE_FONT_COLOR,
				},
				dashes: true,
			} as any);
		} else {
			this.visEdges.update({
				id,
				color: meta.originalColor,
				font: meta.originalFont,
				dashes: false,
			} as any);
		}
	}

	private toggleNodeDone(visId: number): void
	{
		const meta = this.nodeStyles.get(visId);

		if (!meta) {
			return;
		}

		const key = meta.stableKey;
		const isDone = !this.doneKeys.has(key);

		isDone ? this.doneKeys.add(key) : this.doneKeys.delete(key);

		this.applyDoneNodeStyle(visId, isDone);
		this.saveDoneKeys();
	}

	private toggleEdgeDone(visId: number): void
	{
		const meta = this.edgeStyles.get(visId);

		if (!meta) {
			return;
		}

		const key = meta.stableKey;
		const isDone = !this.doneKeys.has(key);

		isDone ? this.doneKeys.add(key) : this.doneKeys.delete(key);

		this.applyDoneEdgeStyle(visId, isDone);
		this.saveDoneKeys();
	}

	public useCytoscape(result: ProductionResult): void
	{
		const options: cytoscape.CytoscapeOptions = {
			container: this.$element[0],
		};
		options.layout = {
			name: 'elk',
			fit: true,
			padding: 200,
			nodeDimensionIncludeLabels: true,
			elk: {
				algorithm: 'layered',
				edgeRouting: 'POLYLINE',
				'spacing.nodeNode': 200,
			},
		} as any;

		const elements: cytoscape.ElementDefinition[] = [];
		for (const node of result.graph.nodes) {
			elements.push({
				data: {
					id: node.id.toString(),
					label: node.getTitle(),
				},
				position: {
					x: 1,
					y: 1,
				},
			});
		}

		for (const edge of result.graph.edges) {
			elements.push({
				data: {
					id: edge.id.toString(),
					source: edge.from.id.toString(),
					target: edge.to.id.toString(),
					label: edge.itemAmount.item,
				},
			});
		}

		options.elements = elements;
		options.style = [
			{
				selector: 'node[label]',
				style: {
					width: 'label',
					height: 'label',
					shape: 'round-rectangle',
					'font-size': '12px',
					label: 'data(label)',
					'text-valign': 'center',
					'text-halign': 'center',
				},
			},
			{
				selector: 'edge[label]',
				style: {
					label: 'data(label)',
					width: 3,
					'curve-style': 'segments',
				},
			},
		];

		const cy = cytoscape(options as any);
	}

	public useVis(result: ProductionResult, storageKey: string): void
	{
		this.storageKey = storageKey;
		this.loadDoneKeys(storageKey);

		this.nodeStyles.clear();
		this.edgeStyles.clear();

		this.visNodes = new DataSet<IVisNode>();
		this.visEdges = new DataSet<IVisEdge>();

		for (const node of result.graph.nodes) {
			const visNode = node.getVisNode();

			this.visNodes.add(visNode);

			// Store original style + stable key for later toggling.
			this.nodeStyles.set(node.id, {
				stableKey: node.getStableKey(),
				originalColor: visNode.color ? { ...visNode.color, highlight: { ...visNode.color.highlight } } : undefined,
				originalFont: visNode.font ? { ...visNode.font } : { color: 'rgba(238, 238, 238, 1)' },
			});
		}

		for (const edge of result.graph.edges) {
			const smooth: any = {
				enabled: false,
			};

			if (edge.to.hasOutputTo(edge.from)) {
				smooth.enabled = true;
				smooth.type = 'curvedCW';
				smooth.roundness = 0.2;
			}

			const edgeColor = {
				color: 'rgba(105, 125, 145, 1)',
				highlight: 'rgba(134, 151, 167, 1)',
			};
			const edgeFont = {
				color: 'rgba(238, 238, 238, 1)',
			};

			this.visEdges.add({
				id:    edge.id,
				from:  edge.from.id,
				to:    edge.to.id,
				label: model.getItem(edge.itemAmount.item).prototype.name + '\n' + Strings.formatNumber(edge.itemAmount.amount) + ' / min',
				color: edgeColor,
				font:  edgeFont,
				smooth,
			} as any);

			this.edgeStyles.set(edge.id, {
				stableKey: edge.getStableKey(),
				originalColor: { ...edgeColor },
				originalFont: { ...edgeFont },
			});
		}

		// Apply persisted done state before the network is drawn.
		this.nodeStyles.forEach(({ stableKey }, visId) => {
			if (this.doneKeys.has(stableKey)) {
				this.applyDoneNodeStyle(visId, true);
			}
		});
		this.edgeStyles.forEach(({ stableKey }, visId) => {
			if (this.doneKeys.has(stableKey)) {
				this.applyDoneEdgeStyle(visId, true);
			}
		});

		this.network = this.drawVisualisation(this.visNodes, this.visEdges);

		this.network.on('doubleClick', (params) => {
			if (params.nodes && params.nodes.length > 0) {
				this.toggleNodeDone(params.nodes[0]);
			} else if (params.edges && params.edges.length > 0) {
				this.toggleEdgeDone(params.edges[0]);
			}
		});

		this.$timeout(0).then(() => {
			const elkGraph: IElkGraph = {
				id: 'root',
				layoutOptions: {
					'elk.algorithm': 'org.eclipse.elk.layered',
					'org.eclipse.elk.layered.nodePlacement.favorStraightEdges': true as unknown as string,
					'org.eclipse.elk.spacing.nodeNode': 40 + '',
				},
				children: [],
				edges: [],
			};

			this.visNodes.forEach((node) => {
				elkGraph.children.push({
					id: node.id.toString(),
					width: 250,
					height: 100,
				});
			});
			this.visEdges.forEach((edge) => {
				elkGraph.edges.push({
					id: '',
					source: edge.from.toString(),
					target: edge.to.toString(),
				});
			});

			this.$timeout(0).then(() => {
				const elk = new ELK();
				elk.layout(elkGraph).then((data) => {
					this.visNodes.forEach((node) => {
						const id = node.id;
						if (data.children) {
							for (const item of data.children) {
								if (parseInt(item.id, 10) === id) {
									this.visNodes.update({
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

	public updateData(result: ProductionResult|undefined, storageKey?: string): void
	{
		if (!result) {
			return;
		}

		this.fitted = false;

		const key = storageKey || this.storageKey || 'default';
		let use;
		use = 'vis';

		if (use === 'cytoscape') {
			this.useCytoscape(result);
		} else {
			this.useVis(result, key);
		}
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
