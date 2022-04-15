import {GraphNode} from '@src/Tools/Production/Result/Nodes/GraphNode';
import {ResourceAmount} from '@src/Tools/Production/Result/ResourceAmount';
import {IVisNode} from '@src/Tools/Production/Result/IVisNode';
import {Strings} from '@src/Utils/Strings';
import {IJsonSchema} from '@src/Schema/IJsonSchema';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {IItemAmountSchema} from '@src/Schema/IItemAmountSchema';

export class InputNode extends GraphNode
{

	public readonly resource: IItemSchema;
	public readonly outputs: ResourceAmount[];

	public constructor(public readonly itemAmount: IItemAmountSchema, data: IJsonSchema)
	{
		super();
		this.resource = data.items[itemAmount.item];
		this.outputs = [new ResourceAmount(this.resource, itemAmount.amount, itemAmount.amount)];
	}

	public getInputs(): ResourceAmount[]
	{
		return [];
	}

	public getOutputs(): ResourceAmount[]
	{
		return this.outputs;
	}

	public getTitle(): string
	{
		return this.formatText('Input: ' + this.resource.name) + '\n' + Strings.formatNumber(this.itemAmount.amount) + ' / min';
	}

	public getTooltip(): string|null
	{
		return null;
	}

	public getVisNode(): IVisNode
	{
		return {
			id: this.id,
			label: this.getTitle(),
			color: {
				border: 'rgba(0, 0, 0, 0)',
				background: 'rgba(175, 109, 14, 1)',
				highlight: {
					border: 'rgba(238, 238, 238, 1)',
					background: 'rgba(234, 146, 18, 1)',
				},
			},
			font: {
				color: 'rgba(238, 238, 238, 1)',
			},
		};
	}

	public getUpdateData(): IVisNode | null
	{
		return {
			id: this.id,
			label: this.getTitle(),
		};
	}

}
