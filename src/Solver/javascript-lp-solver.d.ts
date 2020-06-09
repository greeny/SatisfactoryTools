declare module 'javascript-lp-solver'
{

	export class JavascriptLpSolver
	{

		public Solve(model: ISolverModel, precision?: number, full?: boolean, validate?: boolean): ISolverResult;

	}

	export interface ISolverModel
	{

		optimize: {[key: string]: 'max'|'min'};
		opType?: 'max'|'min';
		variables: {
			[key: string]: {
				[key: string]: number;
			};
		};
		constraints: {
			[key: string]: {
				max?: number;
				min?: number;
				equal?: number;
			};
		};
		ints?: {
			[key: string]: number;
		};
		options?: {
			timeout?: number;
			tolerance?: number;
		};

	}

	export interface ISolverResult
	{

		midpoint: {
			feasible: boolean;
			result: number;
			bounded: boolean;
			isIntegral?: boolean;
			[key: string]: any; // number really
		};

	}

	export interface ISolverResultSingle
	{
		feasible: boolean;
		result: number;
		bounded: boolean;
		isIntegral?: boolean;
		[key: string]: any; // number really
	}

	const solver: JavascriptLpSolver;
	export default solver;

}
