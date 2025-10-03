import {ResourceAmount} from '@src/Tools/Production/Result/ResourceAmount';
import {GraphEdge} from '@src/Tools/Production/Result/Edges/GraphEdge';
import {IVisNode} from '@src/Tools/Production/Result/IVisNode';

export abstract class GraphNode
{

	public id: number;

	public connectedEdges: GraphEdge[] = [];
	public done: boolean = false;

	public static readonly DONE_OPACITY = '0.2';

	public abstract getInputs(): ResourceAmount[];
	public abstract getOutputs(): ResourceAmount[];

	public abstract getTitle(): string;
	public abstract getTooltip(): string|null;

	public abstract getVisNode(): IVisNode;

	public hasOutputTo(target: GraphNode): boolean
	{
		for (const edge of this.connectedEdges) {
			if (edge.from === this && edge.to === target) {
				return true;
			}
		}
		return false;
	}

	public toggleDone(): void
	{
		this.done = !this.done;
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
