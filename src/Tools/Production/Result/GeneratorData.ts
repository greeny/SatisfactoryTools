import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IGeneratorSchema} from '@src/Schema/IGeneratorSchema';
import {IItemSchema} from '@src/Schema/IItemSchema';

export class GeneratorData
{

	public constructor(
		public readonly generator: IGeneratorSchema,
		public readonly machine: IBuildingSchema,
		public readonly fuel: IItemSchema,
		public readonly amount: number,
		public readonly clockSpeed: number,
	)
	{

	}

}
