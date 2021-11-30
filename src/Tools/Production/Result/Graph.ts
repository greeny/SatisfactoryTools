import {GraphNode} from '@src/Tools/Production/Result/Nodes/GraphNode';
import {DataSet} from 'vis-network';
import {IVisNode} from '@src/Tools/Production/Result/IVisNode';
import {IVisEdge} from '@src/Tools/Production/Result/IVisEdge';
import {Strings} from '@src/Utils/Strings';

export class Graph
{

	public readonly DELTA = 1e-8;

	public nodes: GraphNode[] = [];

	public visNodes = new DataSet<IVisNode>();
	public readonly visEdges = new DataSet<IVisEdge>();

	private lastId = 1;

	public addNode(node: GraphNode): void
	{
		this.nodes.push(node);
		node.id = this.lastId++;
	}

	public generate(): void
	{
		for (const node of this.nodes) {
			this.visNodes.add(node.getVisNode());
		}

		let lastEdgeId = 1;
		const edges: {[key: string]: number} = {};

		for (const nodeOut of this.nodes) {
			outputLoop:
			for (const output of nodeOut.getOutputs()) {

				for (const nodeIn of this.nodes) {
					for (const input of nodeIn.getInputs()) {
						if (input.resource === output.resource && input.amount < input.maxAmount) {
							const diff = Math.min(input.maxAmount - input.amount, output.amount);

							output.amount -= diff;
							input.amount += diff;
							if (Math.abs(input.maxAmount - input.amount) < this.DELTA) {
								input.amount = input.maxAmount;
							}
							if (Math.abs(output.amount) < this.DELTA) {
								output.amount = 0;
							}

							const key = nodeOut.id + '-' + nodeIn.id;
							const reverseKey = nodeIn.id + '-' + nodeOut.id;
							if (!(reverseKey in edges)) {
								edges[key] = lastEdgeId;
								this.visEdges.add({
									id: lastEdgeId++,
									from: nodeOut.id,
									to: nodeIn.id,
									label: output.resource.name + '\n' + Strings.formatNumber(diff) + ' / min',
									color: {
										color: 'rgba(105, 125, 145, 1)',
										highlight: 'rgba(134, 151, 167, 1)',
									},
									font: {
										color: 'rgba(238, 238, 238, 1)',
									},
								});
							} else {
								const edge = this.visEdges.get(edges[reverseKey]) as IVisEdge;
								this.visEdges.updateOnly({
									id: edges[reverseKey],
									arrows: 'from,to',
									label: edge.label?.replace('\n', ': ') + '\n' + output.resource.name + ': ' + Strings.formatNumber(diff) + ' / min',
								});
							}

							if (output.amount === 0) {
								continue outputLoop;
							}
						}
					}
				}
			}
		}

		for (const node of this.nodes) {
			const update = node.getUpdateData();
			if (update) {
				this.visNodes.updateOnly(update);
			}
		}
	}

}
