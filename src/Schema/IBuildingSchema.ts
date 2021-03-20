import {IBuildingMetadataSchema, IManufacturerMetadataSchema} from '@src/Schema/IBuildingMetadataSchema';
import {ISizeSchema} from '@src/Schema/ISizeSchema';

export interface IBuildingSchema
{

	slug: string;
	name: string;
	description: string;
	className: string;
	categories: string[];
	buildMenuPriority: number;
	metadata: IBuildingMetadataSchema;
	size: ISizeSchema;

}

export interface IManufacturerSchema extends IBuildingSchema
{

	metadata: IManufacturerMetadataSchema;

}
