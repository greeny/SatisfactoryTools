import {ResourceAmount} from '@src/Tools/Production/Result/ResourceAmount';
import {GraphEdge} from '@src/Tools/Production/Result/Edges/GraphEdge';
import {IVisNode} from '@src/Tools/Production/Result/IVisNode';

export type HighlightState = 'highlighted'|'dependency'|'dependent'|'product'|'unrelated';

export abstract class GraphNode
{

	public id: number;
	public visible: boolean = true;
	public userIgnore: boolean = false;
	public highlighted?: HighlightState;

	public connectedEdges: GraphEdge[] = [];

	public abstract getInputs(): ResourceAmount[];
	public abstract getOutputs(): ResourceAmount[];

	public abstract getTitle(): string;
	public abstract getTooltip(): string|null;

	public abstract getVisNode(): IVisNode;

	public hasOutputTo(target: GraphNode, filter?: string): boolean
	{
		for (const edge of this.connectedEdges) {
			if (edge.from === this && edge.to === target && (!filter || edge.itemAmount.item === filter)) {
				return true;
			}
		}
		return false;
	}

	public getEdgesOut(filter?: string): GraphEdge[] {
		return this.connectedEdges.filter((edge) => edge.from === this && (!filter || edge.itemAmount.item === filter));
	}

	public getEdgesIn(filter?: string): GraphEdge[] {
		return this.connectedEdges.filter((edge) => edge.to === this && (!filter || edge.itemAmount.item === filter));
	}

	public isAvailable(): boolean {
		return this.highlighted !== 'unrelated' && !this.userIgnore;
	}

	protected formatText(text: string, bold: boolean = true)
	{
		const parts = text.split(' ');
		if (parts.length >= 4) {
			parts.splice(Math.ceil(parts.length / 2), 0, bold ? '</b>\n<b>' : '\n');
		}
		return bold ? ('<b>' + parts.join(' ') + '</b>') : parts.join(' ');
	}
}
