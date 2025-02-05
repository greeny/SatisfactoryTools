import model from '@src/Data/Model';
import {GraphNode} from '@src/Tools/Production/Result/Nodes/GraphNode';
import {ItemAmount} from '@src/Tools/Production/Result/ItemAmount';
import { Strings } from '@src/Utils/Strings';

export class GraphEdge
{

	public id: number;

	public constructor(public readonly from: GraphNode, public readonly to: GraphNode, public readonly itemAmount: ItemAmount)
	{
		if (this.to === this.from) {
			this.to.connectedEdges.push(this);
		} else {
			this.from.connectedEdges.push(this);
			this.to.connectedEdges.push(this);
		}
	}

	public getText(): string {
		const missing = this.itemAmount.getAvailable();
		const amount = Strings.formatNumber(this.itemAmount.getAmount());
		const amountText = this.itemAmount.consumed
			? Strings.formatNumber(missing) + ' of ' + amount
			: amount;

		return model.getItem(this.itemAmount.item).prototype.name + '\n' + amountText + ' / min';
	}

	public isLoop(): boolean {
		return this.to.hasOutputTo(this.from);
	}

}
