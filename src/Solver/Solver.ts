import {IProductionToolRequest} from '@src/Tools/Production/IProductionToolRequest';
import axios from 'axios';
import {IProductionToolResponse} from '@src/Tools/Production/IProductionToolResponse';

export class Solver
{

	public static solveProduction(productionRequest: IProductionToolRequest, callback: (response: IProductionToolResponse) => void): void
	{
		axios({
			method: 'post',
			url: 'https://api.satisfactorytools.com/v1/solver',
			data: productionRequest,
		}).then((response) => {
			if ('result' in response.data) {
				callback(response.data.result);
			}
		}).catch(() => {
			callback({});
		});
	}

}
