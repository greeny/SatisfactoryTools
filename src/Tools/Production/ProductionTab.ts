import {ProductionTool} from '@src/Tools/Production/ProductionTool';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {IScope} from 'angular';
import {ItemAmount} from '@src/Data/ItemAmount';
import vis from 'vis-network';

export class ProductionTab
{

	public tool: ProductionTool;
	public item: IItemSchema|null = null;

	private readonly unregisterCallback: () => void;

	public constructor(private readonly scope: IScope)
	{
		this.tool = new ProductionTool;

		this.unregisterCallback = scope.$watch(() => {
			return this.tool.productionRequest.production.map((itemAmount: ItemAmount) => {
				return [itemAmount.item.prototype.className, itemAmount.amount];
			});
		}, () => {
			this.recalculate();
		}, true);
	}

	public unregister(): void
	{
		this.unregisterCallback();
	}

	public addProduct(itemAmount: ItemAmount): void
	{
		this.tool.productionRequest.production.push(itemAmount);
	}

	public removeProduct(product: ItemAmount): void
	{
		const index = this.tool.productionRequest.production.indexOf(product);
		if (index in this.tool.productionRequest.production) {
			this.tool.productionRequest.production.splice(index, 1);
		}
	}

	public recalculate(): void
	{
		this.tool.calculate();
		if (!this.tool.result) {
			return;
		}

		const element = document.getElementById('visualization');
		if (!element) {
			return;
		}

		const network = new vis.Network(element, {
			nodes: this.tool.result.nodes,
			edges: this.tool.result.edges,
		}, {
			edges: {
				labelHighlightBold: false,
				color: '#697d91',
				font: {
					size: 14,
					multi: 'html',
					color: '#eeeeee',
					strokeColor: 'rgba(0, 0, 0, 0.2)',
				},
				arrows: 'to',
				smooth: true,
			},
			nodes: {
				labelHighlightBold: false,
				font: {
					size: 14,
					multi: 'html',
					color: '#eeeeee',
				},
				color: {
					background: '#df691a',
					border: 'rgba(0,0,0,0)',
					highlight: {
						background: '#e77a31',
						border: '#eeeeee',
					},
				},
				margin: {
					top: 10,
					left: 10,
					right: 10,
					bottom: 10,
				},
				shape: 'box',
			},
			physics: {
				enabled: false,
			},
			layout: {
				hierarchical: {
					direction: 'UD',
					blockShifting: true,
					edgeMinimization: true,
					parentCentralization: true,
					sortMethod: 'directed',
					nodeSpacing: 300,
					treeSpacing: 300,
					levelSeparation: 200,
				},
			},
		});
		network.setOptions({
			layout: {
				hierarchical: false,
			},
		});
	}

}
