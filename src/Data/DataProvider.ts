import rawData08 from '@data/data.json';
import rawData10 from '@data/data1.0.json';
import {IJsonSchema} from '@src/Schema/IJsonSchema';
import model from '@src/Data/Model';

export class DataProvider
{

	public static version: string;
	private static data: IJsonSchema;

	public static get(): IJsonSchema
	{
		return DataProvider.data;
	}

	public static change(version: string)
	{
		DataProvider.version = version;
		if (version === '0.8') {
			DataProvider.data = rawData08;
		} else if (version === '1.0') {
			DataProvider.data = rawData10;
		}

		model.change(DataProvider.data);
	}

}
