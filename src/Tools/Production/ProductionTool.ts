import {Solver} from '@src/Solver/Solver';
import model from '@src/Data/Model';
import {RecipeResult} from '@src/Tools/Production/RecipeResult';
import {ProductionToolResult} from '@src/Tools/Production/ProductionToolResult';
import {IProductionToolRequest} from '@src/Tools/Production/IProductionToolRequest';
import data, {Data} from '@src/Data/Data';
import angular, {ITimeoutService} from 'angular';
import {ResultStatus} from '@src/Tools/Production/ResultStatus';

export class ProductionTool
{

	public productionRequest: IProductionToolRequest;
	public resultStatus: ResultStatus = ResultStatus.NO_INPUT;
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
			version: 1,
			name: null,
			icon: null,
			allowedAlternateRecipes: [],
			blockedRecipes: [],
			blockedResources: [],
			sinkableResources: [],
			production: [],
			input: [],
			resourceMax: angular.copy(Data.resourceAmounts),
			resourceWeight: angular.copy(Data.resourceWeights),
		};
	}

	public calculate($timeout?: ITimeoutService): void
	{
		let request = false;

		for (const product of this.productionRequest.production) {
			if (product.item && product.amount > 0) {
				request = true;
				break;
			}
		}

		if (!request) {
			this.resultStatus = ResultStatus.NO_INPUT;
			return;
		}

		this.resultStatus = ResultStatus.CALCULATING;

		const calc = () => {
			Solver.solveProduction(this.productionRequest, (result) => {
				const res = () => {
					const recipes: RecipeResult[] = [];

					for (const k in result) {
						if (!result.hasOwnProperty(k) || !(k in model.recipes) || result[k] < 1e-8) {
							continue;
						}
						recipes.push(new RecipeResult(model.recipes[k], result[k] / 60));
					}

					if (!recipes.length) {
						this.result = undefined;
						this.resultStatus = ResultStatus.NO_RESULT;
						return;
					}
					this.result = new ProductionToolResult(recipes, this.productionRequest);
					this.resultStatus = ResultStatus.RESULT;
				};

				if ($timeout) {
					$timeout(0).then(res);
				} else {
					res();
				}
			});

		};

		if ($timeout) {
			$timeout(0).then(calc);
		} else {
			calc();
		}
	}

}
