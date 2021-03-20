import {RecipeResult} from '@src/Tools/Production/RecipeResult';
import {DataSet} from 'vis-network';
import model from '@src/Data/Model';
import {IElkGraph} from '@src/Solver/IElkGraph';
import {IProductionToolRequest} from '@src/Tools/Production/IProductionToolRequest';

export class ProductionToolResult
{

	public readonly nodes = new DataSet<{
		id: number,
		label: string,
		title?: string,
		color?: {border: string, background: string, highlight: {border: string, background: string}},
		font?: {color: string},
		x?: number,
		y?: number,
		type?: string,
	}>();
	public readonly edges = new DataSet<{
		from: number,
		to: number,
		label?: string,
		title?: string,
		id?: number,
		color?: {color: string, highlight: string},
		font?: {color: string},
	}>();
	public readonly elkGraph: IElkGraph = {
		id: 'root',
		layoutOptions: {
			'elk.algorithm': 'org.eclipse.elk.conn.gmf.layouter.Draw2D',
			'org.eclipse.elk.layered.nodePlacement.favorStraightEdges': true as unknown as string, // fuck off typescript
			'org.eclipse.elk.spacing.nodeNode': 40 + '',
		},
		children: [],
		edges: [],
	};

	public nodeLocationCache: {[id: string]: {x: number, y: number}}|null = null;
	public hiddenNodes: number[] = [];

	public rawResources: {[key: string]: {amount: number, data: {amount: number, id: number}[]}} = {};

	public powerUsage: {average: number, max: number} = {
		average: 0,
		max: 0,
	};

	public powerDetails: {[key: string]: {name: string, amount: number, average: number, max: number}} = {};

	public static readonly TYPE_RAW = 'raw';
	public static readonly TYPE_NORMAL = 'normal';
	public static readonly TYPE_PRODUCT = 'product';
	public static readonly HIDDEN_OPACITY = '0.2';

	private nodeWidth = 300;
	private nodeHeight = 100;

	public constructor(public readonly recipes: RecipeResult[], productionRequest: IProductionToolRequest)
	{
		let id = 1;
		let nodeId = 1;

		for (const recipe of recipes) {
			for (const machine of recipe.machines) {
				const powerUsage = recipe.recipe.machine.metadata.powerConsumption; // TODO handle overclocking
				const avgPowerUsage = machine.amount * powerUsage;
				const maxPowerUsage = Math.ceil(machine.amount) * powerUsage;

				const className = recipe.recipe.machine.className;
				if (!(className in this.powerDetails)) {
					this.powerDetails[className] = {name: recipe.recipe.machine.name, amount: 0, average: 0, max: 0};
				}

				this.powerDetails[className].amount += machine.amount;
				this.powerDetails[className].average += avgPowerUsage;
				this.powerDetails[className].max += maxPowerUsage;

				this.powerUsage.average += avgPowerUsage;
				this.powerUsage.max += maxPowerUsage;
			}

			this.nodes.add({
				id: id,
				label: '',
				title: '',
				color: this.getNodeColor(ProductionToolResult.TYPE_NORMAL, false),
				font: this.getFontColor(false),
				type: ProductionToolResult.TYPE_NORMAL,
			});
			this.elkGraph.children.push({
				id: id.toString(),
				width: this.nodeWidth,
				height: this.nodeHeight,
			});

			recipe.nodeId = id;
			this.updateNode(id);
			id++;
		}

		const inputs: {
			item: string,
			amount: number,
			nodeId: number,
		}[] = [];
		for (const input of productionRequest.input) {
			if (input.item) {
				this.nodes.add({
					id: id,
					label: ProductionToolResult.getRecipeDisplayedName(model.getItem(input.item).prototype.name) + '\n' + input.amount.toFixed(2) + ' / min',
					title: '',
					color: this.getNodeColor(ProductionToolResult.TYPE_RAW, false),
					font: this.getFontColor(false),
					type: ProductionToolResult.TYPE_RAW,
				});
				this.elkGraph.children.push({
					id: id.toString(),
					width: this.nodeWidth,
					height: this.nodeHeight,
				});
				inputs.push({
					item: input.item,
					amount: input.amount,
					nodeId: id,
				});

				id++;
			}
		}

		const edges: {[key: string]: {from: number, to: number, label: string, arrows?: string, color?: {color: string, highlight: string}, font?: {color: string}}} = {};
		for (const recipe of recipes) {
			ingredientLoop:
			for (const ingredient of recipe.recipe.ingredients) {
				let amount = ingredient.amount * recipe.getMachineCount() * 60 * recipe.recipe.machine.metadata.manufacturingSpeed / recipe.recipe.prototype.time;

				for (const input of inputs) {
					if (input.amount > 0 && ingredient.item.prototype.className === input.item) {
						const diff = Math.min(input.amount, amount);
						input.amount -= diff;

						const key = input.nodeId + '-' + recipe.nodeId;
						edges[key] = {
							from: input.nodeId,
							to: recipe.nodeId,
							label: ingredient.item.prototype.name + '\n' + diff.toFixed(2) + '/min',
							color: this.getEdgeColor(false),
							font: this.getFontColor(false),
						};
						this.elkGraph.edges.push({
							id: nodeId.toString(),
							source: input.nodeId.toString(),
							target: recipe.nodeId.toString(),
						});
						nodeId++;
						amount -= diff;
						if (amount <= 1e-8) {
							continue ingredientLoop;
						}
					}
				}

				for (const re of recipes) {
					for (const product of re.productAmountCache) {
						if (product.product === ingredient.item.prototype.className && product.amount > 0) {
							const diff = Math.min(product.amount, amount);
							product.amount -= diff;

							const key = re.nodeId + '-' + recipe.nodeId;
							const reverseKey = recipe.nodeId + '-' + re.nodeId;
							if (!(reverseKey in edges)) {
								edges[key] = {
									from: re.nodeId,
									to: recipe.nodeId,
									label: ingredient.item.prototype.name + '\n' + diff.toFixed(2) + '/min',
									color: this.getEdgeColor(false),
									font: this.getFontColor(false),
								};
							} else {
								edges[reverseKey].arrows = 'from,to';
								edges[reverseKey].label = edges[reverseKey].label.replace('\n', ': ') + '\n' + ingredient.item.prototype.name + ': ' + diff.toFixed(2) + '/min';
							}
							this.elkGraph.edges.push({
								id: nodeId.toString(),
								source: re.nodeId.toString(),
								target: recipe.nodeId.toString(),
							});
							nodeId++;

							amount -= diff;
							if (amount <= 1e-8) {
								continue ingredientLoop;
							}
						}
					}
				}

				if (amount >= 1e-8 && model.isRawResource(ingredient.item)) {
					if (!(ingredient.item.prototype.className in this.rawResources)) {
						this.rawResources[ingredient.item.prototype.className] = {
							amount: 0,
							data: [],
						};
					}
					this.rawResources[ingredient.item.prototype.className].amount += amount;
					this.rawResources[ingredient.item.prototype.className].data.push({
						id: recipe.nodeId,
						amount: amount,
					});
				}
			}
		}

		for (const key in edges) {
			this.edges.add(edges[key]);
		}

		for (const k in this.rawResources) {
			if (this.rawResources.hasOwnProperty(k)) {
				const resource = this.rawResources[k];
				const item = model.getItem(k);

				// TODO add miners
				this.nodes.add({
					id: id,
					label: ProductionToolResult.getRecipeDisplayedName(item.prototype.name) + '\n' + resource.amount.toFixed(2) + ' / min',
					title: '',
					color: this.getNodeColor(ProductionToolResult.TYPE_RAW, false),
					font: this.getFontColor(false),
					type: ProductionToolResult.TYPE_RAW,
				});
				this.elkGraph.children.push({
					id: id.toString(),
					width: this.nodeWidth,
					height: this.nodeHeight,
				});

				for (const data of resource.data) {
					this.edges.add({
						from: id,
						to: data.id,
						label: item.prototype.name + '\n' + data.amount.toFixed(2) + ' / min',
						color: this.getEdgeColor(false),
						font: this.getFontColor(false),
					});
					this.elkGraph.edges.push({
						id: nodeId.toString(),
						source: id.toString(),
						target: data.id.toString(),
					});
					nodeId++;
				}

				id++;
			}
		}

		const producedItems: {[key: string]: {[nodeId: string]: number}} = {};
		for (const recipe of recipes) {
			for (const cache of recipe.productAmountCache) {
				if (Math.abs(cache.amount) >= 1e-2) {
					if (!(cache.product in producedItems)) {
						producedItems[cache.product] = {};
					}
					producedItems[cache.product][recipe.nodeId] = cache.amount;
				}
			}
		}

		for (const index in producedItems) {
			const itemName = model.getItem(index).prototype.name;
			const producedItem = producedItems[index];

			let amount = 0;
			let producedNodeId;
			for (producedNodeId in producedItem) {
				amount += producedItem[producedNodeId];
			}

			this.nodes.add({
				id: id,
				label: ProductionToolResult.getRecipeDisplayedName(itemName) + '\n' + amount.toFixed(2) + ' / min',
				color: this.getNodeColor(ProductionToolResult.TYPE_PRODUCT, false),
				font: this.getFontColor(false),
				type: ProductionToolResult.TYPE_PRODUCT,
			});
			this.elkGraph.children.push({
				id: id.toString(),
				width: this.nodeWidth,
				height: this.nodeHeight,
			});

			for (producedNodeId in producedItem) {
				this.edges.add({
					from: parseInt(producedNodeId, 10),
					to: id,
					label: itemName + '\n' + producedItem[producedNodeId].toFixed(2) + ' / min',
					color: this.getEdgeColor(false),
					font: this.getFontColor(false),
				});
				this.elkGraph.edges.push({
					id: nodeId.toString(),
					source: producedNodeId,
					target: id.toString(),
				});
				nodeId++;
			}
			id++;
		}
	}

	public getNodeColor(type: string, hidden: boolean): {border: string, background: string, highlight: {border: string, background: string}}
	{
		const opacity = hidden ? ProductionToolResult.HIDDEN_OPACITY : '1';
		switch (type) {
			case ProductionToolResult.TYPE_PRODUCT:
				return {
					border: 'rgba(0, 0, 0, 0)',
					background: 'rgba(80, 160, 80, ' + opacity + ')',
					highlight: {
						border: 'rgba(238, 238, 238, ' + opacity + ')',
						background: 'rgba(111, 182, 111, ' + opacity + ')',
					},
				};
			case ProductionToolResult.TYPE_RAW:
				return {
					border: 'rgba(0, 0, 0, 0)',
					background: 'rgba(78, 93, 108, ' + opacity + ')',
					highlight: {
						border: 'rgba(238, 238, 238, ' + opacity + ')',
						background: 'rgba(105, 125, 145, ' + opacity + ')',
					},
				};
			default:
				return {
					border: 'rgba(0, 0, 0, 0)',
					background: 'rgba(223, 105, 26, ' + opacity + ')',
					highlight: {
						border: 'rgba(238, 238, 238, ' + opacity + ')',
						background: 'rgba(231, 122, 49, ' + opacity + ')',
					},
				};
		}
	}

	public getEdgeColor(hidden: boolean): {color: string, highlight: string}
	{
		const opacity = hidden ? ProductionToolResult.HIDDEN_OPACITY : '1';
		return {
			color: 'rgba(105, 125, 145, ' + opacity + ')',
			highlight: 'rgba(134, 151, 167, ' + opacity + ')',
		};
	}

	public getFontColor(hidden: boolean): {color: string}
	{
		const opacity = hidden ? ProductionToolResult.HIDDEN_OPACITY : '1';
		return {
			color: 'rgba(238, 238, 238, ' + opacity + ')',
		};
	}

	public toggleNode(id: number): void
	{
		const index = this.hiddenNodes.indexOf(id);
		let hidden = true;
		if (index !== -1) {
			this.hiddenNodes.splice(index, 1);
			hidden = false;
		} else {
			this.hiddenNodes.push(id);
		}
		const node = this.nodes.get(id);
		if (node) {
			const type = node.type ? node.type : ProductionToolResult.TYPE_NORMAL;
			node.color = this.getNodeColor(type, hidden);
			node.font = this.getFontColor(hidden);
			this.nodes.updateOnly(node);

			this.edges.forEach((edge) => {
				if (edge.from === id || edge.to === id) {
					if (this.hiddenNodes.indexOf(edge.from) === -1 && this.hiddenNodes.indexOf(edge.to) === -1) {
						hidden = false;
					} else {
						hidden = true;
					}
					edge.color = this.getEdgeColor(hidden);
					edge.font = this.getFontColor(hidden);
					this.edges.updateOnly(edge as any);
				}
			});
		}
	}

	public updateNode(id: number): void
	{
		let recipe;
		for (const item of this.recipes) {
			if (item.nodeId === id) {
				recipe = item;
				break;
			}
		}
		if (!recipe) {
			return;
		}
		this.nodes.update({
			id: id,
			label: ProductionToolResult.getRecipeDisplayedName(recipe.recipe.prototype.name) + '\n' + recipe.getMachineCount().toFixed(2) + 'x ' + recipe.recipe.machine.name,
			title: recipe.getMachineTooltip(),
		});
	}

	private static getRecipeDisplayedName(name: string): string
	{
		const parts = name.split(' ');
		if (parts.length >= 4) {
			parts.splice(Math.ceil(parts.length / 2), 0, '</b>\n<b>');
		}
		return '<b>' + parts.join(' ') + '</b>';
	}

}
