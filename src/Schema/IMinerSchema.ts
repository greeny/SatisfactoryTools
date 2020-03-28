export interface IMinerSchema
{

	className: string;
	allowedResources: string[];
	allowLiquids: boolean;
	allowSolids: boolean;
	itemsPerCycle: number;
	extractCycleTime: number;
}
