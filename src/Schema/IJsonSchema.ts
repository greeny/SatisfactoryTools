import {IItemSchema} from '@src/Schema/IItemSchema';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {IResourceSchema} from '@src/Schema/IResourceSchema';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IMinerSchema} from '@src/Schema/IMinerSchema';
import {IGeneratorSchema} from '@src/Schema/IGeneratorSchema';
import {ISchematicSchema} from '@src/Schema/ISchematicSchema';

export interface IJsonSchema
{

	items: {[key: string]: IItemSchema};
	recipes: {[key: string]: IRecipeSchema};
	schematics: {[key: string]: ISchematicSchema};
	generators: {[key: string]: IGeneratorSchema};
	resources: {[key: string]: IResourceSchema};
	miners: {[key: string]: IMinerSchema};
	buildings: {[key: string]: IBuildingSchema};

}
