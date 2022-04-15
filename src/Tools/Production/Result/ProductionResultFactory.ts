import {IProductionDataApiRequest, IProductionDataApiResponse} from '@src/Tools/Production/IProductionData';
import {IJsonSchema} from '@src/Schema/IJsonSchema';
import {IManufacturerSchema} from '@src/Schema/IBuildingSchema';
import {RecipeData} from '@src/Tools/Production/Result/RecipeData';
import {RecipeNode} from '@src/Tools/Production/Result/Nodes/RecipeNode';
import {MinerNode} from '@src/Tools/Production/Result/Nodes/MinerNode';
import {ProductNode} from '@src/Tools/Production/Result/Nodes/ProductNode';
import {ByproductNode} from '@src/Tools/Production/Result/Nodes/ByproductNode';
import {InputNode} from '@src/Tools/Production/Result/Nodes/InputNode';
import {Graph} from '@src/Tools/Production/Result/Graph';
import {ProductionResult} from '@src/Tools/Production/Result/ProductionResult';
import {SinkNode} from '@src/Tools/Production/Result/Nodes/SinkNode';

export class ProductionResultFactory
{

	public create(request: IProductionDataApiRequest, response: IProductionDataApiResponse, data: IJsonSchema): ProductionResult
	{
		return new ProductionResult(request, ProductionResultFactory.createGraph(response, data), data);
	}

	private static createGraph(response: IProductionDataApiResponse, data: IJsonSchema): Graph
	{
		const graph = new Graph;

		for (const recipeData in response) {
			if (!response.hasOwnProperty(recipeData)) {
				continue;
			}

			let machineData;
			let machineClass;
			let recipeClass;
			let clockSpeed;
			const amount = parseFloat(response[recipeData] + '');

			[machineData, machineClass] = recipeData.split('#');

			if (machineClass === 'Mine') {
				graph.addNode(new MinerNode({
					item: machineData,
					amount: amount,
				}, data));
			} else if (machineClass === 'Sink') {
				if (machineData in data.items) {
					graph.addNode(new SinkNode({
						item: machineData,
						amount: amount,
					}, data));
				}
			} else if (machineClass === 'Product') {
				if (machineData in data.items) {
					graph.addNode(new ProductNode({
						item: machineData,
						amount: amount,
					}, data));
				}
			} else if (machineClass === 'Byproduct') {
				if (machineData in data.items) {
					graph.addNode(new ByproductNode({
						item: machineData,
						amount: amount,
					}, data));
				}
			} else if (machineClass === 'Input') {
				if (machineData in data.items) {
					graph.addNode(new InputNode({
						item: machineData,
						amount: amount,
					}, data));
				}
			} else {
				[recipeClass, clockSpeed] = machineData.split('@');

				if (clockSpeed) {
					graph.addNode(new RecipeNode(new RecipeData(
						data.buildings[machineClass] as IManufacturerSchema,
						data.recipes[recipeClass],
						amount,
						parseInt(clockSpeed, 10),
					), data));
				}
			}
		}

		graph.generateEdges();

		return graph;
	}

}
