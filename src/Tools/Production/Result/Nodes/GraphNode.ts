import {IVisNode} from '@src/Tools/Production/Result/IVisNode';
import {ResourceAmount} from '@src/Tools/Production/Result/ResourceAmount';

export abstract class GraphNode
{

	public id: number;

	public abstract getVisNode(): IVisNode;
	public abstract getInputs(): ResourceAmount[];
	public abstract getOutputs(): ResourceAmount[];

	public getUpdateData(): IVisNode|null
	{
		return null;
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
