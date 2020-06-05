import {ISolverResultSingle} from 'javascript-lp-solver';
import {Solver} from '@src/Solver/Solver';
import model from '@src/Data/Model';
import {RecipeResult} from '@src/Tools/Production/RecipeResult';
import {ProductionToolResult} from '@src/Tools/Production/ProductionToolResult';
import {IProductionToolRequest} from '@src/Tools/Production/IProductionToolRequest';
import data, {Data} from '@src/Data/Data';

export class ProductionTool
{

	public productionRequest: IProductionToolRequest;
	public result: ProductionToolResult|undefined;

	public constructor()
	{
		this.resetProductionRequest();
	}

	get icon(): string|null
	{
		if (this.productionRequest.icon) {
			return this.productionRequest.icon;
		}
		const items = this.productionRequest.production.filter((item) => {
			return !!item.item;
		});
		return items.length ? items[0].item : null;
	}

	get name(): string
	{
		if (this.productionRequest.name) {
			return this.productionRequest.name;
		}
		const items = this.productionRequest.production.filter((item) => {
			return !!item.item;
		});
		return items.length ? (data.getItemByClassName(items[0].item || '')?.name + ' Factory') : 'Unnamed Factory';
	}

	public resetProductionRequest(): void
	{
		this.productionRequest = {
			name: null,
			icon: null,
			allowedAlternateRecipes: [],
			blockedRecipes: [],
			blockedResources: [],
			production: [],
			resourceMax: Data.resourceAmounts,
			resourceWeight: Data.resourceWeights,
		};
	}

	public calculate(): void
	{
		const result = this.getResult();

		if (!result.feasible) {
			this.result = undefined;
			return;
		}

		const recipes: RecipeResult[] = [];

		for (const k in result) {
			if (!result.hasOwnProperty(k) || !(k in model.recipes) || result[k] < 1e-8) {
				continue;
			}
			recipes.push(new RecipeResult(model.recipes[k], result[k] / 60));
		}

		if (!recipes.length) {
			this.result = undefined;
			return;
		}

		this.result = new ProductionToolResult(recipes);
	}

	private getResult(): ISolverResultSingle
	{
		const result = Solver.solveProduction(this.productionRequest);
		if ('midpoint' in result) {
			return result.midpoint;
		} else {
			return result;
		}
	}

}
