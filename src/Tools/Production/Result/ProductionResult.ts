import {Graph} from '@src/Tools/Production/Result/Graph';
import {InputNode} from '@src/Tools/Production/Result/Nodes/InputNode';
import {MinerNode} from '@src/Tools/Production/Result/Nodes/MinerNode';
import {
	IBuildingsResultDetails,
	IInputResultDetails,
	IItemBuildingAmountResultDetails,
	IItemResultDetails,
	IMachinePowerDetails,
	IRawResourceResultDetails,
	IRecipePowerDetails,
	IResultDetails
} from '@src/Tools/Production/Result/IResultDetails';
import {RecipeNode} from '@src/Tools/Production/Result/Nodes/RecipeNode';
import {IJsonSchema} from '@src/Schema/IJsonSchema';
import {GraphEdge} from '@src/Tools/Production/Result/Edges/GraphEdge';
import {GraphNode} from '@src/Tools/Production/Result/Nodes/GraphNode';
import {Objects} from '@src/Utils/Objects';
import {IProductionDataApiRequest} from '@src/Tools/Production/IProductionData';
import {ProductNode} from '@src/Tools/Production/Result/Nodes/ProductNode';
import {ByproductNode} from '@src/Tools/Production/Result/Nodes/ByproductNode';
import {Numbers} from '@src/Utils/Numbers';

export class ProductionResult
{

	public details: IResultDetails = {
		buildings: {
			buildings: {},
			resources: {},
			amount: 0,
		},
		power: {
			byRecipe: {},
			byBuilding: {},
			total: {
				isVariable: false,
				average: 0,
				max: 0,
			},
		},
		items: {},
		input: {},
		hasInput: false,
		rawResources: {},
		output: {},
		byproducts: {},
		alternatesNeeded: [],
	};

	public constructor(request: IProductionDataApiRequest, public readonly graph: Graph, schema: IJsonSchema)
	{
		this.calculateBuildings(schema);
		this.calculateItems(schema);
		this.calculateInput(request, schema);
		this.calculateRawResources(request, schema);
		this.calculateProducts();
		this.findAlternateRecipes(schema);
		this.calculatePower(schema);
	}

	private calculateBuildings(schema: IJsonSchema): void
	{
		const buildings: IBuildingsResultDetails = {
			buildings: {},
			resources: {},
			amount: 0,
		};
		for (const node of this.graph.nodes) {
			if (node instanceof RecipeNode) {
				const className = node.recipeData.machine.className;
				const amount = Math.ceil(node.recipeData.amount);

				if (!(className in buildings.buildings)) {
					buildings.buildings[className] = {
						amount: 0,
						recipes: {},
						resources: {},
					};
				}

				buildings.buildings[className].amount += amount;
				buildings.buildings[className].recipes[node.recipeData.recipe.className] = {
					amount: amount,
					resources: ProductionResult.calculateBuildingCost(className, amount, schema),
				}
			}
		}

		for (const k in buildings.buildings) {
			buildings.buildings[k].resources = ProductionResult.sumBuildingCost(Object.values(buildings.buildings[k].recipes).map((value) => {
				return value.resources;
			}));
		}

		buildings.resources = ProductionResult.sumBuildingCost(Object.values(buildings.buildings).map((value) => {
			return value.resources;
		}));

		let totalAmount = 0;
		for (const building in buildings.buildings) {
			totalAmount += buildings.buildings[building].amount;
		}

		buildings.amount = totalAmount;

		this.details.buildings = buildings;
		this.details.buildings.buildings = Objects.sortByKeys(buildings.buildings, (building1: string, building2: string) => {
			const name1 = schema.buildings[building1].name;
			const name2 = schema.buildings[building2].name;
			if (name1 < name2) {
				return -1;
			}
			if (name1 > name2) {
				return 1;
			}
			return 0;
		});
	}

	private calculateItems(schema: IJsonSchema): void
	{
		const items: {[key: string]: IItemResultDetails} = {};

		for (const node of this.graph.nodes) {
			for (const edge of node.connectedEdges) {
				ProductionResult.addItem(items, node, edge);
			}
		}

		for (const itemClass in items) {
			const item = items[itemClass];
			item.diff = Numbers.round(item.produced - item.consumed);

			for (const p in item.producers) {
				if (item.producers.hasOwnProperty(p)) {
					item.producers[p].itemPercentage = Numbers.round(item.producers[p].itemAmount / item.produced * 100);
				}
			}
			for (const c in item.consumers) {
				if (item.consumers.hasOwnProperty(c)) {
					item.consumers[c].itemPercentage = Numbers.round(item.consumers[c].itemAmount / item.consumed * 100);
				}
			}
		}

		this.details.items = Objects.sortByKeys(items, (item1: string, item2: string) => {
			const name1 = schema.items[item1].name;
			const name2 = schema.items[item2].name;
			const isRaw1 = item1 in schema.resources;
			const isRaw2 = item2 in schema.resources;

			if (isRaw1 && !isRaw2) {
				return -1;
			}
			if (!isRaw1 && isRaw2) {
				return 1;
			}

			if (name1 < name2) {
				return -1;
			}
			if (name1 > name2) {
				return 1;
			}
			return 0;
		});
	}

	private calculateInput(request: IProductionDataApiRequest, schema: IJsonSchema): void
	{
		const inputs: {[key: string]: IInputResultDetails} = {};

		for (const input of request.input) {
			if (input.item && input.amount > 0 && (input.item in schema.items)) {
				if (!(input.item in inputs)) {
					inputs[input.item] = {
						used: 0,
						max: 0,
						usedPercentage: 0,
						producedExtra: 0,
					};
				}
				inputs[input.item].max += input.amount;
			}
		}

		for (const node of this.graph.nodes) {
			if (node instanceof InputNode) {
				const itemClass = node.itemAmount.item;
				if (itemClass in inputs) { // just a sanity check, should be always true
					inputs[itemClass].used += node.itemAmount.amount;
				}
			} else if (node instanceof RecipeNode) {
				for (const product of node.getOutputs()) {
					if (product.resource.className in inputs) {
						inputs[product.resource.className].producedExtra += product.maxAmount;
					}
				}
			} else if (node instanceof MinerNode) {
				if (node.itemAmount.item in inputs) {
					inputs[node.itemAmount.item].producedExtra += node.itemAmount.amount;
				}
			}
		}

		for (const k in inputs) {
			const input = inputs[k];
			input.used = Numbers.round(input.used);
			input.max = Numbers.round(input.max);
			input.usedPercentage = Numbers.round(input.used / input.max * 100);
		}

		this.details.input = inputs;
		this.details.hasInput = Object.keys(inputs).length > 0;
	}

	private calculateRawResources(request: IProductionDataApiRequest, schema: IJsonSchema): void
	{
		const resources: {[key: string]: IRawResourceResultDetails} = {};

		for (const resource in Objects.sortByKeys(schema.resources, (item1: string, item2: string) => {
			const name1 = schema.items[item1].name;
			const name2 = schema.items[item2].name;

			if (name1 < name2) {
				return -1;
			}
			if (name1 > name2) {
				return 1;
			}
			return 0;
		})) {
			resources[resource] = {
				enabled: request.blockedResources.indexOf(resource) === -1,
				max: request.resourceMax[resource] || 0,
				used: 0,
				usedPercentage: 0,
			};
		}

		for (const node of this.graph.nodes) {
			if (node instanceof MinerNode && node.itemAmount.item in resources) {
				resources[node.itemAmount.item].used += node.itemAmount.amount;
			}
		}

		for (const resource in resources) {
			resources[resource].used = Numbers.round(resources[resource].used);
			resources[resource].usedPercentage = Numbers.round(resources[resource].used / resources[resource].max * 100);
		}

		this.details.rawResources = resources;
	}

	private calculateProducts(): void
	{
		const products: {[key: string]: number} = {};
		const byproducts: {[key: string]: number} = {};

		for (const node of this.graph.nodes) {
			if (node instanceof ProductNode) {
				ProductionResult.addProduct(products, node.itemAmount.item, node.itemAmount.amount);
			} else if (node instanceof ByproductNode) {
				ProductionResult.addProduct(byproducts, node.itemAmount.item, node.itemAmount.amount);
			}
		}

		this.details.output = products;
		this.details.byproducts = byproducts;
	}

	private calculatePower(schema: IJsonSchema): void
	{
		const byRecipe: {[key: string]: IRecipePowerDetails} = {};
		const byBuilding: {[key: string]: IMachinePowerDetails} = {};
		for (const node of this.graph.nodes) {
			if (node instanceof RecipeNode) {
				const machineClass = node.recipeData.machine.className;
				const recipeClass = node.recipeData.recipe.className;

				byRecipe[recipeClass] = {
					machine: machineClass,
					power: {
						average: Numbers.round(node.machineData.power.average),
						max: Numbers.round(node.machineData.power.max),
						isVariable: node.machineData.power.isVariable,
					},
					machines: node.machineData.machines,
				};

				if (!(machineClass in byBuilding)) {
					byBuilding[machineClass] = {
						amount: 0,
						power: {
							max: 0,
							isVariable: false,
							average: 0,
						},
						recipes: {},
					};
				}

				byBuilding[machineClass].recipes[recipeClass] = {
					clockSpeed: node.recipeData.clockSpeed,
					amount: node.machineData.countMachines(),
					power: {
						average: Numbers.round(node.machineData.power.average),
						max: Numbers.round(node.machineData.power.max),
						isVariable: node.machineData.power.isVariable,
					},
				};
				byBuilding[machineClass].amount += node.machineData.countMachines();

				byBuilding[machineClass].power.average += node.machineData.power.average;
				byBuilding[machineClass].power.max += node.machineData.power.max;
				if (node.machineData.power.isVariable) {
					byBuilding[machineClass].power.isVariable = true;
				}
			}
		}

		let isVariable = false;
		let average = 0;
		let max = 0;

		for (const machine in byBuilding) {
			average += byBuilding[machine].power.average;
			max += byBuilding[machine].power.max;
			if (byBuilding[machine].power.isVariable) {
				isVariable = true;
			}

			byBuilding[machine].power.average = Numbers.round(byBuilding[machine].power.average);
			byBuilding[machine].power.max = Numbers.round(byBuilding[machine].power.max);
		}

		if (Math.abs(max - average) < 1e-8) {
			isVariable = false;
		}

		average = Numbers.round(average);
		max = Numbers.round(max);

		this.details.power = {
			total: {
				isVariable: isVariable,
				average: average,
				max: max,
			},
			byBuilding: byBuilding,
			byRecipe: byRecipe,
		};
	}

	private findAlternateRecipes(schema: IJsonSchema): void
	{
		const recipes: string[] = [];

		for (const node of this.graph.nodes) {
			if (node instanceof RecipeNode && node.recipeData.recipe.alternate) {
				if (recipes.indexOf(node.recipeData.recipe.className) === -1) {
					recipes.push(node.recipeData.recipe.className);
				}
			}
		}

		this.details.alternatesNeeded = recipes.sort((recipe1: string, recipe2: string) => {
			const name1 = schema.recipes[recipe1].name;
			const name2 = schema.recipes[recipe2].name;
			if (name1 < name2) {
				return -1;
			}
			if (name1 > name2) {
				return 1;
			}
			return 0;
		}).map((className: string) => {
			return schema.recipes[className];
		});
	}

	private static addProduct(products: {[key: string]: number}, product: string, amount: number): void
	{
		if (!(product in products)) {
			products[product] = 0;
		}
		products[product] += amount;
	}

	private static addItem(items: {[key: string]: IItemResultDetails}, node: GraphNode, edge: GraphEdge): void
	{
		const className = edge.itemAmount.item;
		const amount = Numbers.round(edge.itemAmount.amount);

		let outgoing: boolean|null = null;

		if (edge.from !== edge.to) {
			if (edge.from === node) {
				outgoing = true;
			} else if (edge.to === node) {
				outgoing = false;
			}
		}

		if (!(className in items)) {
			items[className] = {
				consumed: 0,
				consumers: {},
				produced: 0,
				producers: {},
				diff: 0,
			};
		}

		if (outgoing === true) {
			if (edge.to instanceof RecipeNode) {
				ProductionResult.addRecipeAmount(items[className].consumers, edge.to.recipeData.recipe.className, amount);
				items[className].consumed += amount;
			}
		} else if (outgoing === false) {
			if (edge.from instanceof RecipeNode) {
				ProductionResult.addRecipeAmount(items[className].producers, edge.from.recipeData.recipe.className, amount);
				items[className].produced += amount;
			} else if (edge.from instanceof MinerNode) {
				ProductionResult.addRecipeAmount(items[className].producers, edge.from.itemAmount.item, amount, 'miner');
				items[className].produced += amount;
			} else if (edge.from instanceof InputNode) {
				ProductionResult.addRecipeAmount(items[className].producers, edge.from.itemAmount.item, amount, 'input');
			}
		} else {
			items[className].produced += amount;
			items[className].consumed += amount;
		}

		items[className].diff = Numbers.round(items[className].produced - items[className].consumed);
	}

	private static addRecipeAmount(data: {[key: string]: IItemBuildingAmountResultDetails}, className: string, amount: number, type: string = 'recipe'): void
	{
		if (!(className in data)) {
			data[className] = {
				type: type,
				itemAmount: 0,
				itemPercentage: 0,
			};
		}
		data[className].itemAmount += amount;
	}

	private static calculateBuildingCost(buildingClass: string, amount: number, schema: IJsonSchema): {[key: string]: number}
	{
		const cost: {[key: string]: number} = {};
		for (const recipeClass in schema.recipes) {
			const recipe = schema.recipes[recipeClass];
			if (recipe.products.length && recipe.products[0].item === buildingClass) {
				for (const ingredient of recipe.ingredients) {
					cost[ingredient.item] = amount * ingredient.amount;
				}
			}
		}
		return cost;
	}

	private static sumBuildingCost(costs: {[key: string]: number}[]): {[key: string]: number}
	{
		const cost: {[key: string]: number} = {};

		for (const i in costs) {
			for (const k in costs[i]) {
				if (!(k in cost)) {
					cost[k] = 0;
				}
				cost[k] += costs[i][k];
			}
		}

		return cost;
	}

}
