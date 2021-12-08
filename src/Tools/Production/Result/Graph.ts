import {GraphNode} from '@src/Tools/Production/Result/Nodes/GraphNode';
import {GraphEdge} from '@src/Tools/Production/Result/Edges/GraphEdge';
import {ItemAmount} from '@src/Tools/Production/Result/ItemAmount';

export class Graph
{

	public readonly DELTA = 1e-8;

	public nodes: GraphNode[] = [];
	public edges: GraphEdge[] = [];

	private lastId = 1;

	public addNode(node: GraphNode): void
	{
		this.nodes.push(node);
		node.id = this.lastId++;
	}

	public addEdge(edge: GraphEdge): void
	{
		this.edges.push(edge);
		edge.id = this.lastId++;
	}

	public generateEdges(): void
	{
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

							this.addEdge(new GraphEdge(nodeOut, nodeIn, new ItemAmount(output.resource.className, diff)));

							if (output.amount === 0) {
								continue outputLoop;
							}
						}
					}
				}
			}
		}
	}

}
