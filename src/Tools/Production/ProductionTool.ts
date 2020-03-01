import {ItemAmount} from '@src/Data/ItemAmount';
import {ISolverResultSingle} from 'javascript-lp-solver';
import {Solver} from '@src/Solver/Solver';
import model from '@src/Data/Model';
import {RecipeResult} from '@src/Tools/Production/RecipeResult';
import {ProductionToolResult} from '@src/Tools/Production/ProductionToolResult';

export class ProductionTool
{

	public production: ItemAmount[] = [];
	public result: ProductionToolResult|undefined;

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
		const result = Solver.solveProduction(this.production);
		if ('midpoint' in result) {
			return result.midpoint;
		} else {
			return result;
		}
	}

}
