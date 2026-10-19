import {GraphNode} from '@src/Tools/Production/Result/Nodes/GraphNode';
import {ItemAmount} from '@src/Tools/Production/Result/ItemAmount';

export class GraphEdge
{

	public id: number;

	public constructor(public readonly from: GraphNode, public readonly to: GraphNode, public readonly itemAmount: ItemAmount)
	{
		from.connectedEdges.push(this);
		to.connectedEdges.push(this);
	}

	public getStableKey(): string
	{
		return `edge:${this.from.getStableKey()}=>${this.to.getStableKey()}:${this.itemAmount.item}`;
	}
}
