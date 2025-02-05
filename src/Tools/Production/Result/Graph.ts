import {GraphNode} from '@src/Tools/Production/Result/Nodes/GraphNode';
import {GraphEdge} from '@src/Tools/Production/Result/Edges/GraphEdge';
import {ItemAmount} from '@src/Tools/Production/Result/ItemAmount';
import {IProductionDataRequestCompleted} from '@src/Tools/Production/IProductionData';
import {CalcHighlight} from '@src/Tools/Production/Result/CalcHighlight';
import {Numbers} from '@src/Utils/Numbers';

export interface GraphSettings {
	applyCompleted: boolean,
	showCompleted: boolean,
	showHighlightDependents: boolean,
	showHighlightLimits: boolean,
}

export class Graph
{

	public nodes: GraphNode[] = [];
	public edges: GraphEdge[] = [];
	public completedMap: CompletedMap = { };
	public highlightedNode?: GraphNode;
	public highlightedLimit?: number;

	private lastId = 1;
	private outputToNodeMap?: ItemToNodeMap;

	public constructor(public settings: GraphSettings) { }

	public setSettings(settings: GraphSettings) {
		this.settings = settings;
		this.recalculate();
	}

	public addNode(node: GraphNode): void
	{
		this.nodes.push(node);
		this.outputToNodeMap = undefined;
		node.id = this.lastId++;
	}

	public addEdge(edge: GraphEdge): void
	{
		this.edges.push(edge);
		edge.id = this.lastId++;
	}

	public highlight(node: GraphNode) {
		new CalcHighlight(this).set(node);
	}

	public toogleNode(node: GraphNode) {
		new CalcHighlight(this).toggle(node);
	}

	public generateEdges(completed: IProductionDataRequestCompleted[]): void
	{
		this.edges = [];
		this.completedMap = { };

		const outputToNodeMap = this.getOutputToNodeMap();

		for (const item of completed) {
			if (item.recipe) {
				this.completedMap[item.recipe] = (this.completedMap[item.recipe] || 0) + item.amount;
			}
		}

		for (const checkSharedResources of [true, false]) {
			for (const nodeIn of this.nodes) {
				for (const input of nodeIn.getInputs()) {
					const nodesOut = outputToNodeMap[input.resource.className];
					for (const nodeOut of nodesOut) {
						if (checkSharedResources && !hasSharedResources(nodeIn, nodeOut)) {
							continue;
						}

						for (const output of nodeOut.getOutputs()) {
							if (input.resource === output.resource && input.amount < input.maxAmount) {
								const diff = Numbers.round(Math.min(input.maxAmount - input.amount, output.amount));

								if (diff <= 0) {
									continue;
								}

								output.decrease(diff);
								input.increase(diff);

								this.addEdge(new GraphEdge(nodeOut, nodeIn, new ItemAmount(output.resource.className, diff)));
							}
						}
					}
				}
			}
		}

		this.recalculate();
	}

	private recalculate() {
		new CalcHighlight(this).update();
	}

	private getOutputToNodeMap(): ItemToNodeMap {
		if (!this.outputToNodeMap) {
			this.outputToNodeMap = { };

			for (const node of this.nodes) {
				for (const output of node.getOutputs()) {
					const className = output.resource.className;
					const  nodeList = this.outputToNodeMap[className] || [];
					nodeList.push(node);
					this.outputToNodeMap[className] = nodeList;
				}
			}
		}

		return this.outputToNodeMap;
	}

}

function hasSharedResources(nodeIn: GraphNode, nodeOut: GraphNode): boolean {
	let sharedInputs = 0;
	let sharedOutputs = 0;

	for (const input of nodeIn.getInputs()) {
		for (const output of nodeOut.getOutputs()) {
			if (input.resource === output.resource) {
				++sharedInputs;
			}
		}
	}

	for (const output of nodeIn.getOutputs()) {
		for (const input of nodeOut.getInputs()) {
			if (input.resource === output.resource) {
				++sharedOutputs;
			}
		}
	}

	return (sharedInputs > 0) && (sharedOutputs > 0);
}

interface ItemToNodeMap { [key:string]: GraphNode[] }
interface CompletedMap { [key:string]: number }
