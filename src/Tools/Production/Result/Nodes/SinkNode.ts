import {GraphNode} from '@src/Tools/Production/Result/Nodes/GraphNode';
import {IVisNode} from '@src/Tools/Production/Result/IVisNode';
import {ResourceAmount} from '@src/Tools/Production/Result/ResourceAmount';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {IItemAmountSchema} from '@src/Schema/IItemAmountSchema';
import {IJsonSchema} from '@src/Schema/IJsonSchema';
import {Strings} from '@src/Utils/Strings';
import {Constants} from '@src/Constants';

export class SinkNode extends GraphNode
{

	public readonly resource: IItemSchema;
	public readonly inputs: ResourceAmount[];
	public readonly outputs: ResourceAmount[];

	public constructor(public readonly itemAmount: IItemAmountSchema, data: IJsonSchema)
	{
		super();
		this.resource = data.items[itemAmount.item];
		this.inputs = [new ResourceAmount(this.resource, itemAmount.amount, 0)];
		this.outputs = [new ResourceAmount(data.items[Constants.SINK_POINTS_CLASSNAME], this.itemAmount.amount * this.resource.sinkPoints, this.itemAmount.amount * this.resource.sinkPoints)];
	}

	public getInputs(): ResourceAmount[]
	{
		return this.inputs;
	}

	public getOutputs(): ResourceAmount[]
	{
		return this.outputs;
	}

	public getTitle(): string
	{
		return this.formatText('</b>Sink:<b> ' + this.resource.name) + '\n' + Strings.formatItemAmount(this.itemAmount.amount, this.itemAmount.item) + '\n';
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
				background: 'rgba(217, 83, 79, 1)',
				highlight: {
					border: 'rgba(238, 238, 238, 1)',
					background: 'rgba(224, 117, 114, 1)',
				},
			},
			font: {
				color: 'rgba(238, 238, 238, 1)',
			},
		};
	}

}
