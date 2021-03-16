import {Graph} from '@src/Tools/Production/Result/Graph';

export class ProductionResult
{

	public readonly graph: Graph = new Graph;

	public finalise(): void
	{
		this.graph.generate();
	}

}
