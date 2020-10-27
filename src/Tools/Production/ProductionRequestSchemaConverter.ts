import {IProductionToolRequest} from '@src/Tools/Production/IProductionToolRequest';
import {Data} from '@src/Data/Data';

export class ProductionRequestSchemaConverter
{

	private static converters: ((schema: IProductionToolRequest) => IProductionToolRequest)[] = [
		(schema: IProductionToolRequest) => { // version 1, added input
			schema.input = [];
			return schema;
		},
		(schema: IProductionToolRequest) => { // version 2, changed resource weights and oil limit, preparation for sinkable resources
			if (schema.resourceMax.Desc_LiquidOil_C === 7500) {
				schema.resourceMax.Desc_LiquidOil_C = Data.resourceAmounts.Desc_LiquidOil_C;
			}
			schema.resourceWeight = Data.resourceWeights;
			schema.sinkableResources = [];
			return schema;
		},
	];

	public static convert(schema: IProductionToolRequest): IProductionToolRequest
	{
		let version = 0;
		if (schema.version) {
			version = schema.version;
		}

		for (; version < this.converters.length; version++) {
			schema = this.converters[version](schema);
			schema.version = version + 1;
		}

		return schema;
	}

}
