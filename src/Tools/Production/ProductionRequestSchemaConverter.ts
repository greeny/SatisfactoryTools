import {IProductionToolRequest} from '@src/Tools/Production/IProductionToolRequest';

export class ProductionRequestSchemaConverter
{

	private static converters: ((schema: IProductionToolRequest) => IProductionToolRequest)[] = [
		(schema: IProductionToolRequest) => {
			schema.input = [];
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
