import rawData from '@data/data.json';
import {default as solver, ISolverModel, ISolverResult, ISolverResultSingle} from 'javascript-lp-solver';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {IJsonSchema} from '@src/Schema/IJsonSchema';
import {ItemAmount} from '@src/Data/ItemAmount';

export class Solver
{

	public static solveProduction(production: ItemAmount[]): ISolverResult|ISolverResultSingle
	{
		const data: IJsonSchema = rawData as any;
		const model: ISolverModel = {
			optimize: {},
			constraints: {},
			variables: {},
		};

		const rawResources: {[key: string]: number} = {};

		for (const k in data.items) {
			if (data.items.hasOwnProperty(k)) {
				const item = data.items[k];
				if (!(item.className in data.resources)) {
					model.constraints[item.className] = {
						min: 0,
					};
				} else {
					model.constraints[item.className] = {
						max: 0,
					};
					rawResources[item.className] = 1; // TODO add weights
				}
			}
		}

		// TODO optimize for whatever is needed
		model.variables['rawResources'] = rawResources;
		model.optimize['rawResources'] = 'max';

		for (const itemAmount of production) {
			//delete model.optimize[itemAmount.item.prototype.className];
			model.constraints[itemAmount.item.prototype.className] = {
				equal: parseFloat(itemAmount.amount + ''),
			};
		}

		for (const k in data.recipes) {
			if (data.recipes.hasOwnProperty(k)) {
				const recipe: IRecipeSchema = data.recipes[k];
				if (recipe.alternate) {
					continue; // TODO enable based on user's preferences
				}

				if (!recipe.inMachine) {
					continue;
				}
				const def: {[key: string]: number} = {};
				for (const ingredient of recipe.ingredients) {
					if (!(ingredient.item in def)) {
						def[ingredient.item] = 0;
					}
					def[ingredient.item] += -ingredient.amount;
				}
				for (const product of recipe.products) {
					if (!(product.item in def)) {
						def[product.item] = 0;
					}
					def[product.item] += product.amount;
				}
				model.variables[recipe.className] = def;
			}
		}

		return solver.Solve(model);
	}

}
