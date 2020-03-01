import {ProductionTool} from '@src/Tools/Production/ProductionTool';
import model from '@src/Data/Model';
import {Item} from '@src/Data/Item';
import {ItemAmount} from '@src/Data/ItemAmount';
import vis from 'vis-network';
import {IRootScopeService} from 'angular';

export class ProductionController
{

	public readonly tool: ProductionTool;
	public readonly craftableItems: Item[] = model.getAutomatableItems();
	public result: string;

	public static $inject = ['$rootScope'];

	public constructor(rootScope: IRootScopeService)
	{
		this.tool = new ProductionTool;
		this.recalculate();
		rootScope.$watch(() => {
			return this.tool.production.map((itemAmount: ItemAmount) => {
				return [itemAmount.item.prototype.className, itemAmount.amount];
			});
		}, () => {
			this.recalculate();
		}, true);
	}

	public addEmptyProduct(): void
	{
		this.tool.production.push(new ItemAmount(this.craftableItems[0], 1));
		this.recalculate();
	}

	public removeProduct(product: ItemAmount): void
	{
		const index = this.tool.production.indexOf(product);
		if (index in this.tool.production) {
			this.tool.production.splice(index, 1);
		}
		this.recalculate();
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
