export interface ILocalStorageProductionTabState
{
	amount: number;
	ratio: number;
	max: boolean;
	item: string;
}

export interface ILocalStorageProductionState
{
	items: ILocalStorageProductionTabState[];
}
