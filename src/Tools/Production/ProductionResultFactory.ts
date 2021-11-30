import {IProductionDataApiResponse} from '@src/Tools/Production/IProductionData';
import {ProductionResult} from '@src/Tools/Production/ProductionResult';
import {IJsonSchema} from '@src/Schema/IJsonSchema';
import {IManufacturerSchema} from '@src/Schema/IBuildingSchema';
import {RecipeData} from '@src/Tools/Production/Result/RecipeData';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {RecipeNode} from '@src/Tools/Production/Result/Nodes/RecipeNode';
import {MinerNode} from '@src/Tools/Production/Result/Nodes/MinerNode';
import {ProductNode} from '@src/Tools/Production/Result/Nodes/ProductNode';
import {ByproductNode} from '@src/Tools/Production/Result/Nodes/ByproductNode';
import {InputNode} from '@src/Tools/Production/Result/Nodes/InputNode';

export class ProductionResultFactory
{

	private data: IJsonSchema;
	private result: ProductionResult;

	public create(response: IProductionDataApiResponse, data: IJsonSchema): ProductionResult
	{
		this.data = data;
		this.result = new ProductionResult;

		this.parseRecipes(response);

		this.result.finalise();

		return this.result;
	}

	private parseRecipes(response: IProductionDataApiResponse): void
	{
		for (const recipeData in response) {
			if (!response.hasOwnProperty(recipeData)) {
				continue;
			}

			let machineData;
			let machineClass;
			let recipeClass;
			let clockSpeed;
			const amount = response[recipeData];

			[machineData, machineClass] = recipeData.split('#');

			if (machineClass === 'Mine') {
				this.result.graph.addNode(new MinerNode({
					item: machineData,
					amount: amount,
				}, this.data));
			} else if (machineClass === 'Product') {
				if (machineData in this.data.items) {
					this.result.graph.addNode(new ProductNode({
						item: machineData,
						amount: amount,
					}, this.data));
				}
			} else if (machineClass === 'Byproduct') {
				if (machineData in this.data.items) {
					this.result.graph.addNode(new ByproductNode({
						item: machineData,
						amount: amount,
					}, this.data));
				}
			} else if (machineClass === 'Input') {
				if (machineData in this.data.items) {
					this.result.graph.addNode(new InputNode({
						item: machineData,
						amount: amount,
					}, this.data));
				}
			} else {
				[recipeClass, clockSpeed] = machineData.split('@');

				if (clockSpeed) {
					this.result.graph.addNode(new RecipeNode(new RecipeData(
						this.getManufacturer(machineClass),
						this.getRecipe(recipeClass),
						amount,
						parseInt(clockSpeed, 10),
					), this.data));
				}
			}
		}
	}

	private getManufacturer(machineClass: string): IManufacturerSchema
	{
		return this.data.buildings[machineClass] as IManufacturerSchema;
	}

	private getRecipe(recipeClass: string): IRecipeSchema
	{
		return this.data.recipes[recipeClass];
	}

}
