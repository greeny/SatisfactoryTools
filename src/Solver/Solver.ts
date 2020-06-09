import rawData from '@data/data.json';
import {default as solver, ISolverModel, ISolverResult, ISolverResultSingle} from 'javascript-lp-solver';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {IJsonSchema} from '@src/Schema/IJsonSchema';
import {IProductionToolRequest} from '@src/Tools/Production/IProductionToolRequest';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';

export class Solver
{

	public static solveProduction(productionRequest: IProductionToolRequest): ISolverResult|ISolverResultSingle
	{
		const data: IJsonSchema = rawData;
		const model: ISolverModel = {
			optimize: {},
			constraints: {},
			variables: {},
		};

		for (const k in data.items) {
			if (data.items.hasOwnProperty(k)) {
				const item = data.items[k];
				if (!(item.className in data.resources)) {
					model.constraints[item.className] = {
						min: 0,
					};
				} else {
					if (productionRequest.blockedResources.indexOf(item.className) !== -1) {
						model.constraints[item.className] = {
							equal: 0,
						};
					} else {
						model.constraints[item.className] = {
							max: 0,
							min: -productionRequest.resourceMax[item.className],
						};
					}
				}
			}
		}

		// TODO optimize for whatever is needed
		model.optimize.weight = 'min';

		for (const production of productionRequest.production) {
			if (production.item === null) {
				continue;
			}
			model.constraints[production.item] = {
				equal: parseFloat(production.amount + ''),
			};
		}

		for (const k in data.recipes) {
			if (data.recipes.hasOwnProperty(k)) {
				const recipe: IRecipeSchema = data.recipes[k];
				if (!recipe.inMachine) {
					continue;
				}

				if (recipe.alternate && productionRequest.allowedAlternateRecipes.indexOf(recipe.className) === -1) {
					continue;
				}

				if (!recipe.alternate && productionRequest.blockedRecipes.indexOf(recipe.className) !== -1) {
					continue;
				}

				model.constraints[recipe.className] = {
					min: 0,
				};

				let machine: IBuildingSchema|null = null;
				if (recipe.producedIn.length > 0) {
					machine = data.buildings[recipe.producedIn[0]];
				}

				const def: {[key: string]: number} = {};
				for (const ingredient of recipe.ingredients) {
					if (!(ingredient.item in def)) {
						def[ingredient.item] = 0;
					}
					def[ingredient.item] += -ingredient.amount;

					if (ingredient.item in productionRequest.resourceWeight) {
						if (!('weight' in def)) {
							def.weight = 0;
						}
						def.weight += ingredient.amount * productionRequest.resourceWeight[ingredient.item];
					}
				}
				for (const product of recipe.products) {
					if (!(product.item in def)) {
						def[product.item] = 0;
					}
					def[product.item] += product.amount;

					if (product.item in productionRequest.resourceWeight) {
						if (!('weight' in def)) {
							def.weight = 0;
						}
						def.weight -= product.amount * productionRequest.resourceWeight[product.item];
					}
				}
				/*if (machine && machine.metadata.powerConsumption) {
					def.power = -machine.metadata.powerConsumption * recipe.time;
				}*/
				model.variables[recipe.className] = def;
			}
		}

		return solver.Solve(model);
	}

}
